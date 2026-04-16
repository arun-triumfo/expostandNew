import { Head, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Login({ status }) {
    useEffect(() => {
        document.documentElement.classList.add('admin-login-page');
        return () => document.documentElement.classList.remove('admin-login-page');
    }, []);

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.login.store'));
    };

    const errorMessage = errors.email || errors.password;

    return (
        <>
            <Head>
                <title>Expostandzone | Admin Panel</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=2" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@100..900&display=swap"
                    rel="stylesheet"
                />
                <link rel="stylesheet" type="text/css" href="/admin/css/login.css" />
            </Head>

            <div className="logincontainer admin-login-replica">
                <div className="container">
                    <div className="error">
                        {errorMessage && <p>{errorMessage}</p>}
                        {status && (
                            <div className="alert alert-success" role="alert">
                                {status}
                            </div>
                        )}
                    </div>
                    <div className="loginmainbg">
                        <div className="row justify-content-center">
                            <div className="col-lg-6 col-md-12">
                                <div className="logincaps">
                                    <div className="caps">
                                        POWERED BY <span>EXPOSTANDZONE</span>
                                        <span className="expologo">
                                            <img src="/admin/images/logo2.png" width="192" height="60" alt="Expostandzone" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12">
                                <div className="loginbg">
                                    <div className="innerlogin">
                                        <h1 className="maintitle">EXPOSTANDZONE</h1>
                                        <div className="bgwhitebg">
                                            <div className="topbg">
                                                <h2 className="title">Login to your Account</h2>
                                                <form onSubmit={submit} noValidate>
                                                    <label>
                                                        User Email<span>*</span>
                                                    </label>
                                                    <div className="input-outer">
                                                        <input
                                                            type="text"
                                                            name="email"
                                                            placeholder="Email Address"
                                                            autoComplete="username"
                                                            value={data.email}
                                                            onChange={(e) => setData('email', e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <label>
                                                        Password<span>*</span>
                                                    </label>
                                                    <div className="input-outer">
                                                        <input
                                                            type="password"
                                                            name="password"
                                                            placeholder="Password"
                                                            autoComplete="current-password"
                                                            value={data.password}
                                                            onChange={(e) => setData('password', e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="rememberme">
                                                        <input
                                                            type="checkbox"
                                                            id="remember"
                                                            checked={data.remember}
                                                            onChange={(e) => setData('remember', e.target.checked)}
                                                        />
                                                        <span className="item-text">Remember Me</span>
                                                    </div>
                                                    <input
                                                        type="submit"
                                                        name="submit"
                                                        value={processing ? 'PLEASE WAIT…' : 'LOGIN'}
                                                        disabled={processing}
                                                    />
                                                </form>
                                            </div>
                                            <div className="bottombg" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
