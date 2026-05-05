<!DOCTYPE html>
<html>
<head>
    <title>Verify Your Review - Expostandzone</title>
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
            background-color: #026aa2;
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
            background-color: #026aa2;
            color: white !important;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
            text-align: center;
        }
        .button:hover {
            background-color: #015c8e;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
        }
        .link {
            word-break: break-all;
            color: #026aa2;
        }
        .company-name {
            font-weight: bold;
            color: #026aa2;
        }
        .warning {
            color: #dc3545;
            font-size: 14px;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin: 0;">⏳ Reminder: Verify Your Email to Publish Your Review</h2>
        </div>
        <div class="content">
            <p>Dear {{ $review->reviewer_name }},</p>
            
            <p>Thank you for submitting a review for <span class="company-name">{{ $standbuilder->companyname }}</span>. To complete the review process, please verify your email by clicking the button below:</p>
            
            <!--<div style="text-align: center;">-->
            <!--    <a href="{{ url('/review/verify/' . $verification->token) }}" class="button">-->
            <!--        Verify Review-->
            <!--    </a>-->
            <!--</div>-->
            
              <div style="text-align: center;">
                <a href="{{ url('/review/verify/'.$verification->token) }}" class="button">
                    Verify Review
                </a>
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p class="link">{{ url('/review/verify/'.$verification->token) }}</p>
            <p class="warning">This verification link will expire in 7 days.</p>
        </div>
        <div class="footer">
            <p>Best regards,<br>Expostandzone Team</p>
            <p style="font-size: 12px; color: #999;">This is an automated message, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html> 