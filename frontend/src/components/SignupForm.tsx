const SignupForm = () => {
  return (
    <>
      <form action="">
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-lg border p-4">
          <label className="fieldset-legend text-lg">Signup</label>

          <label className="label">Name</label>
          <input type="text" className="input w-lg" placeholder="Name" />

          <label className="label">Email</label>
          <input type="email" className="input w-lg" placeholder="Email" />

          <label className="label">Password</label>
          <input
            type="password"
            className="input w-lg"
            placeholder="Password"
          />

          <button className="btn btn-neutral mt-4">Signup</button>
        </fieldset>
      </form>
    </>
  );
};

export default SignupForm;
