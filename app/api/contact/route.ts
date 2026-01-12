import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { Redis } from '@upstash/redis';

// Initialize Redis (Lazily)
const redis = Redis.fromEnv();

// Check Rate Limit Status
export async function GET(req: Request) {
    try {
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
        const ratelimitKey = `contact_limit:${ip}`;

        const ttl = await redis.ttl(ratelimitKey);

        if (ttl > 0) {
            return NextResponse.json({ restricted: true, ttl });
        }

        return NextResponse.json({ restricted: false });

    } catch (error) {
        console.error('Redis error in rate limit check:', error);
        // Return degraded flag so frontend knows Redis is down
        return NextResponse.json({ restricted: false, degraded: true });
    }
}

// Check Rate Limit Status
export async function POST(req: Request) {
    try {
        // 1. Rate Limiting (10 Minutes per IP)
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
        const ratelimitKey = `contact_limit:${ip}`;

        // Try to set key ONLY if it doesn't exist (NX) with 10 min expiry (EX 600)
        const success = await redis.set(ratelimitKey, '1', { nx: true, ex: 600 });

        if (!success) {
            return NextResponse.json(
                { success: false, message: 'Rate limit exceeded. Please wait 10 minutes.' },
                { status: 429 }
            );
        }

        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
        }

        // Configure Transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        // 1. Notification Email to Admin (You)
        const adminMailOptions = {
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER, // Send to yourself
            subject: `New Portfolio Lead: ${email}`,
            text: `
                SYSTEM ALERT // NEW CONNECTION
                ------------------------------
                Source: ${email}
                Timestamp: ${new Date().toISOString()}
                
                Action Required: Establish Uplink.
            `,
            html: `
                <div style="font-family: monospace; background: #000; color: #0f0; padding: 20px;">
                    <h2 style="border-bottom: 1px solid #333; padding-bottom: 10px;">SYSTEM ALERT // NEW CONNECTION</h2>
                    <p style="color: #fff;"><strong>Source:</strong> <a href="mailto:${email}" style="color: #fff;">${email}</a></p>
                    <p style="color: #666;">Timestamp: ${new Date().toISOString()}</p>
                    <br/>
                    <p style="color: #f00;">>> ACTION REQUIRED: Establish Uplink.</p>
                </div>
            `
        };

        // 2. Acknowledgment Email to Client (Data Request - Generalized)
        const clientMailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Action Required // Complete Your Connection Request',
            text: `
                UPLINK ESTABLISHED.
                
                We have received your signal. To proceed with the connection, please REPLY to this email with the following details:

                1. [ NAME ]            : (Your Name)
                2. [ CONTACT_NO ]      : (Mobile Number)
                3. [ IDENTIFICATION ]  : (Are you a Developer or Client?)
                4. [ MESSAGE_PAYLOAD ] : (Your Message)

                Afsal
                Founding Engineer
            `,
            html: `
                <div style="background-color: #050505; color: #e5e5e5; font-family: 'Courier New', Courier, monospace; padding: 40px; border: 1px solid #333; max-width: 600px; margin: 0 auto;">
                    
                    <!-- Header -->
                    <div style="border-bottom: 2px solid #b91c1c; padding-bottom: 10px; margin-bottom: 30px;">
                        <span style="color: #b91c1c; font-weight: bold; font-size: 24px;">>> UPLINK ESTABLISHED</span>
                    </div>

                    <p style="color: #a3a3a3; font-size: 14px;">SIGNAL_STRENGTH: <span style="color: #22c55e;">STRONG</span></p>
                    <p style="color: #a3a3a3; font-size: 14px;">PACKET_STATUS: <span style="color: #eab308;">AWAITING_DATA</span></p>

                    <br/>

                    <p style="line-height: 1.6;">
                        Greetings. We have received your initial ping. To better route your request, please provide the standard identification details below.
                    </p>

                    <p style="font-weight: bold; color: #fff; margin-top: 30px;">
                        [ ACTION REQUIRED ]
                    </p>
                    <p>
                        Please <strong>REPLY</strong> to this transmission filling in the following parameters:
                    </p>

                    <!-- Data Request Block -->
                    <div style="background-color: #171717; padding: 20px; border-left: 4px solid #b91c1c; margin: 20px 0; font-size: 14px;">
                        <p style="margin: 10px 0;"><span style="color: #737373;">01.</span> <span style="color: #fff;">NAME .............:</span> _________________</p>
                        <p style="margin: 10px 0;"><span style="color: #737373;">02.</span> <span style="color: #fff;">CONTACT_NO .......:</span> _________________</p>
                        <p style="margin: 10px 0;"><span style="color: #737373;">03.</span> <span style="color: #fff;">IDENTIFICATION ...:</span> (Developer / Client)</p>
                        <p style="margin: 10px 0;"><span style="color: #737373;">04.</span> <span style="color: #fff;">MESSAGE_PAYLOAD ..:</span> (Your Message)</p>
                    </div>

                    <br/>
                    
                    <p style="font-size: 12px; color: #525252;">
                        // END_OF_TRANSMISSION<br/>
                        // AWAITING_REPLY...
                    </p>

                    <hr style="border: 0; border-top: 1px solid #333; margin: 40px 0;"/>
                    
                    <div style="font-size: 12px; color: #737373;">
                        <strong style="color: #fff;">Afsal</strong><br/>
                        Founding Engineer<br/>
                        <a href="https://afsal.dev" style="color: #b91c1c; text-decoration: none;">afsal.dev</a>
                    </div>
                </div>
            `
        };

        // Send both emails
        await Promise.all([
            transporter.sendMail(adminMailOptions),
            transporter.sendMail(clientMailOptions)
        ]);

        return NextResponse.json({ success: true, message: 'Uplink established' });

    } catch (error) {
        console.error('Mail error:', error);
        return NextResponse.json({ success: false, message: 'Failed to send signal' }, { status: 500 });
    }
}
