import { useNavigate } from "react-router-dom";

interface HeroProps {
  btn: string;
  text: string;
  link: string;
}

const Hero: React.FC<HeroProps> = ({ btn, text, link }) => {
  const navigate = useNavigate();
  return (
    <div className="hero bg-base-200 max-w-300 max-h-80 rounded-md">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Verbatim</h1>
          <p className="py-6">
            Verbatim is where ideas find their voice. A space for thoughtful
            writing, honest stories, and deep reflections — shared without
            filters, exactly as they were meant to be read.
          </p>
          <p className="py-6">{text}</p>
          <button
            onClick={() => {
              navigate(link);
            }}
            className="btn btn-primary"
          >
            {btn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
