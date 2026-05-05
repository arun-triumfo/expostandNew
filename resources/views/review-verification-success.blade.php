<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Review verified | Expostandzone</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <style>
        .verification-success { padding: 80px 0; }
        .success-message { background: #fff; padding: 40px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .success-message h2 { margin: 20px 0; color: #28a745; }
    </style>
</head>
<body>
<section class="verification-success">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8 text-center">
                <div class="success-message">
                    <i class="fa fa-check-circle text-success" style="font-size: 64px;"></i>
                    <h2>Review Verified Successfully!</h2>
                    <p>Thank you for verifying your review. Your feedback is now live on the stand builder&apos;s public profile.</p>
                    <a href="{{ url('/') }}" class="btn btn-primary mt-4">Return to Homepage</a>
                </div>
            </div>
        </div>
    </div>
</section>
</body>
</html>
