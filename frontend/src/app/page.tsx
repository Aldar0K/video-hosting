import { VideoPlayer } from "@/shared/ui/video-player";

const Home = () => {
  return (
    <div className="p-6">
      <div className="mx-auto max-w-xl space-y-4">
        <VideoPlayer initialUrl="http://localhost:3001/video" />
      </div>
    </div>
  );
};

export default Home;
