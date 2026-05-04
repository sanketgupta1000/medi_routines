import SignupForm from "../forms/SignupForm";
function SignupPage() {

    return(        <>
        

            <div className="max-w-md mx-auto p-4">
                <h2 className="text-2xl font-semibold mb-6">Sign Up</h2>

                <SignupForm />
            </div>

        </>

    );

}

export default SignupPage;