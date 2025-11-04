const express = require('express');
const cors = require('cors');
const path = require('path');
const emailService = require('./utils/emailService-sendgrid');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

console.log('Environment variables loaded:');
console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? '✅ Set' : '❌ Not set');
console.log('MAIL_USERNAME:', process.env.MAIL_USERNAME ? '✅ Set' : '❌ Not set');
console.log('MAIL_PASSWORD:', process.env.MAIL_PASSWORD ? '✅ Set' : '❌ Not set');

const app = express();
const PORT = process.env.BACKEND_PORT || 9000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());

// In-memory storage for project inquiries (in production, use a database)
let projectInquiries = [];
let nextId = 1;

// Routes
app.post('/api/v1/project-inquiries/', async (req, res) => {
    try {
        const inquiryData = req.body;

        // Validate required fields
        if (!inquiryData.full_name || !inquiryData.email || !inquiryData.project_description) {
            return res.status(400).json({
                error: 'Missing required fields: full_name, email, project_description'
            });
        }

        // Create inquiry object
        const inquiry = {
            id: nextId++,
            ...inquiryData,
            created_at: new Date().toISOString(),
            status: 'new'
        };

        // Store inquiry
        projectInquiries.push(inquiry);

        // Send email notification
        try {
            await emailService.sendContactFormEmail({
                name: inquiryData.full_name,
                email: inquiryData.email,
                phone: inquiryData.phone || '',
                budget: inquiryData.budget_estimate || '',
                timeline: inquiryData.project_timeline || '',
                message: inquiryData.project_description,
                priority: 'Media'
            });

            console.log('✅ Email sent successfully for inquiry:', inquiry.id);
        } catch (emailError) {
            console.error('❌ Failed to send email:', emailError.message);
            // Don't fail the request if email fails, just log it
        }

        res.status(201).json({
            message: 'Project inquiry created successfully',
            inquiry: {
                id: inquiry.id,
                status: inquiry.status,
                created_at: inquiry.created_at
            }
        });

    } catch (error) {
        console.error('Error creating project inquiry:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/v1/project-inquiries/', (req, res) => {
    const { skip = 0, limit = 100 } = req.query;
    const start = parseInt(skip);
    const end = start + parseInt(limit);

    const paginatedInquiries = projectInquiries.slice(start, end);

    res.json({
        inquiries: paginatedInquiries,
        total: projectInquiries.length,
        skip: start,
        limit: parseInt(limit)
    });
});

app.get('/api/v1/project-inquiries/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const inquiry = projectInquiries.find(i => i.id === id);

    if (!inquiry) {
        return res.status(404).json({ error: 'Project inquiry not found' });
    }

    res.json(inquiry);
});

app.get('/api/v1/project-inquiries/email/:email', (req, res) => {
    const email = req.params.email;
    const userInquiries = projectInquiries.filter(i => i.email === email);

    res.json({
        inquiries: userInquiries,
        total: userInquiries.length
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Documentation redirect
app.get('/docs', (req, res) => {
    res.redirect('/redoc');
});

app.get('/redoc', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Stratek API Documentation</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                h1 { color: #333; }
                .endpoint { background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 5px; }
                .method { font-weight: bold; color: #0066cc; }
            </style>
        </head>
        <body>
            <h1>Stratek Project Inquiries API</h1>
            <p>Base URL: http://localhost:9000/api/v1</p>

            <h2>Endpoints</h2>

            <div class="endpoint">
                <span class="method">POST</span> /project-inquiries/
                <p>Create new project inquiry</p>
                <p><strong>Required:</strong> full_name, email, project_description</p>
                <p><strong>Optional:</strong> phone, budget_estimate, project_timeline</p>
            </div>

            <div class="endpoint">
                <span class="method">GET</span> /project-inquiries/
                <p>List all inquiries (with pagination)</p>
                <p><strong>Query params:</strong> skip, limit</p>
            </div>

            <div class="endpoint">
                <span class="method">GET</span> /project-inquiries/{id}
                <p>Get inquiry by ID</p>
            </div>

            <div class="endpoint">
                <span class="method">GET</span> /project-inquiries/email/{email}
                <p>Get inquiries by email</p>
            </div>
        </body>
        </html>
    `);
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Stratek API server running on port ${PORT}`);
    console.log(`📧 Email service configured`);
    console.log(`📚 API docs: http://localhost:${PORT}/docs`);
});

module.exports = app;