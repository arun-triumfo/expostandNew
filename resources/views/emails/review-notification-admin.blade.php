<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Review Submitted - Approval Needed</title>
    <style>
        body {
            font-family: Arial, sans-serif;
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
            background-color: #e74c3c;
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
        .review-details {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
            border: 1px solid #dee2e6;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #e74c3c;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .link {
            word-break: break-all;
            color: #026aa2;
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
            <h2 style="margin: 0;">🚨 New Review Submitted – Approval Needed</h2>
        </div>
        <div class="content">
            <p>Dear Admin,</p>
            
            <p>A new rating and review have been submitted for <strong>{{ $standbuilder->companyname }}</strong> on Expostandzone.com.</p>
            
            <div class="review-details">
                <h3 style="color: #2c3e50; margin-top: 0;">📌 Review Details:</h3>
                
                <p><strong>Stand Builder:</strong> {{ $standbuilder->companyname }}</p>
                <p><strong>User:</strong> {{ $review->reviewer_name }}</p>
                <p><strong>Rating:</strong> ⭐ {{ number_format(($review->design_rating + $review->quality_rating + $review->project_rating + $review->cost_rating) / 4, 1) }}</p>
                <p><strong>Review:</strong> "{{ $review->review_text }}"</p>
            </div>
            
            <!--<div style="text-align: center;">-->
            <!--    <a href="{{ url('/admin/reviews') }}" class="button">Review Approval Link</a>-->
            <!--</div>-->
            <!--<p > if the button doesn't work, you can copy and paste this link into your browser:</p>-->
            <!--<p class="link">{{ url('/admin/reviews') }}</p>-->
            
            <div style="text-align: center;">
                <a href="{{ url('/admin/reviews') }}" class="button">Review Approval Link</a>
            </div>
            <p > if the button doesn't work, you can copy and paste this link into your browser:</p>
            <p class="link">{{ url('/admin/reviews') }}</p>
            
            
            <p>Please verify and approve the review as per platform guidelines.</p>
        </div>
        <div class="footer">
            <p>Best regards,<br>Expostandzone System</p>
            <p style="font-size: 12px; color: #999;">This is an automated message, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html> 