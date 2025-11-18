import { useState } from "react";
import toast from "react-hot-toast";
import { authStore } from "../store/store";
import Hero from "../components/Hero";

const LoginPage = () => {
  const { login } = authStore();
  // frontend form values
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.email.trim()) return toast.error("Email is a required field");
    if (!formData.password.trim())
      return toast.error("Password is a required field");
    if (formData.password.length < 6)
      return toast.error("Password must be atleast 6 characters long");

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = validateForm();
    if (result == true) {
      login(formData);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 h-screen">
      <div className="flex flex-col justify-start items-center gap-20 mt-10">
        <Hero btn="Sign up" text="Dont have an account yet?" link="/signup" />
        <form onSubmit={handleSubmit}>
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-lg border p-4">
            <label className="fieldset-legend text-lg">Login</label>

            <label className="label">Email</label>
            <input
              name="email"
              type="email"
              className="input w-lg"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />

            <label className="label">Password</label>
            <input
              name="password"
              type="password"
              className="input w-lg"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />

            <button className="btn btn-neutral mt-4">Login</button>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
