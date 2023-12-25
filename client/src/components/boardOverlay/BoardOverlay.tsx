import Share from "./share/Share";
import Tools from "./tools/Tools";

export default function BoardOverlay() {
  return (
    <div className="fixed w-full h-full p-6 pointer-events-none">
      <div className="relative w-full h-full">
        <Share />
        <Tools />
      </div>
    </div>
  );
}