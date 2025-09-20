import { VideoPlayer } from "@/shared/ui/video-player";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto max-w-4xl">
        <VideoPlayer initialUrl="http://localhost:3001/video" />
      </div>
    </div>
  );
};

export default Home;
