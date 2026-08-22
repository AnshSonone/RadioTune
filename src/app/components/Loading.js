export default function Loading({progress}) {
  return (
    <div className={`${progress} transition-all duration-1000 transform h-0.5 bg-red-800 overflow-hidden`}>
    </div>
  );
}