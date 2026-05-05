<!DOCTYPE html>
<html>
<head>
    <title>Your Review is Live on Expostandzone!</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
        }
        .header {
            background-color: #28a745;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            padding: 20px;
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 0 0 5px 5px;
        }
        .button {
            display: inline-block;
            background-color: #28a745;
            color: white !important;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
            text-align: center;
        }
        .link {
            word-break: break-all;
            color: #026aa2;
        }
        .button:hover {
            background-color: #218838;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin: 0;">🎉 Your Review is Live on Expostandzone!</h2>
        </div>
        <div class="content">
            <p>Dear {{ $reviewerName }},</p>
            
            <p>Your review for {{ $standbuilderName }} has been published successfully on Expostandzone.com!</p>
            
            <div style="text-align: center;">
                <a href="{{ url('/'.$standbuilder->slug) }}" class="button">
                    🔗 View your review here
                </a>
            </div>
            <p > if the button doesn't work, you can copy and paste this link into your browser:</p>
            <p class="link">{{ url('/'.$standbuilder->slug) }}</p>
            <p>Thank you for sharing your experience and helping the exhibitor community.</p>
        </div>
        <div class="footer">
            <p>Best regards,<br>Expostandzone Team</p>
            <p style="font-size: 12px; color: #999;">This is an automated message, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html> 