<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Verification failed | Expostandzone</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <style>
        .verification-failed { padding: 80px 0; }
        .error-message { background: #fff; padding: 40px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .error-message h2 { margin: 20px 0; color: #dc3545; }
    </style>
</head>
<body>
<section class="verification-failed">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8 text-center">
                <div class="error-message">
                    <i class="fa fa-times-circle text-danger" style="font-size: 64px;"></i>
                    <h2>Verification Failed</h2>
                    <p>Sorry, we could not verify your review. The link may have expired, already been used, or is invalid.</p>
                    <p>If you believe this is an error, please contact <a href="mailto:enquiry@expostandzone.com">enquiry@expostandzone.com</a>.</p>
                    <a href="{{ url('/') }}" class="btn btn-primary mt-4">Return to Homepage</a>
                </div>
            </div>
        </div>
    </div>
</section>
</body>
</html>
