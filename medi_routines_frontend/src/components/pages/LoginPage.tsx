import LoginForm from "../forms/LoginForm";

function LoginPage() {

    return(        <>
        

            <div className="max-w-md mx-auto p-4">
                <h2 className="text-2xl font-semibold mb-6">Log In</h2>

                <LoginForm />
            </div>

        </>

    );

}

export default LoginPage;