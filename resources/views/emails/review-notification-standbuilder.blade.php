<!DOCTYPE html>
<html>
<head>
    <title>New Review Alert for Your Company on Expostandzone</title>
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
            background-color: #3498db;
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
        .details {
            background-color: #fff;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
            border-left: 4px solid #3498db;
        }
        .button {
            display: inline-block;
            background-color: #3498db;
            color: white !important;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
            text-align: center;
        }
        .button:hover {
            background-color: #2980b9;
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
        .star-rating {
            color: #f1c40f;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin: 0;">⭐ New Review Alert for Your Company on Expostandzone</h2>
        </div>
        <div class="content">
            <p>Dear {{ $standbuilder->companyname }},</p>
            
            <p>A new rating and review have been submitted for your company profile on Expostandzone.com.</p>
            
            <div class="details">
                <h3 style="margin-top: 0;">📌 Review Details:</h3>
                <p>
                    <strong>Rating:</strong> 
                    <span class="star-rating">
                        @php
                            $averageRating = round(($review->design_rating + $review->quality_rating + $review->project_rating + $review->cost_rating) / 4);
                        @endphp
                        {{ str_repeat('⭐', $averageRating) }}
                    </span>
                </p>
                <p><strong>Review:</strong> "{{ $review->review_text }}"</p>
            </div>
            
            <!--<div style="text-align: center;">-->
            <!--    <a href="{{ url('/' . $standbuilder->slug) }}" class="button">-->
            <!--        🔗 View the review here-->
            <!--    </a>-->
            <!--</div>-->
            <!--<p>If you can't access the link, please copy and paste the following URL into your browser:</p>-->
            <!--<p class="link">{{ url('/' . $standbuilder->slug) }}</p>-->
            
               <div style="text-align: center;">
                <a href="{{ url('/'.$standbuilder->slug) }}" class="button">
                    🔗 View the review here
                </a>
            </div>
            <p>If you can't access the link, please copy and paste the following URL into your browser:</p>
            <p class="link">{{ url('/'.$standbuilder->slug) }}</p>
            
            
            
            <p>Engaging with reviews helps build trust and attract more exhibitors. You may respond to the review through your dashboard.</p>
        </div>
        <div class="footer">
            <p>Best regards,<br>Expostandzone Team</p>
            <p style="font-size: 12px; color: #999;">This is an automated message, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html> 