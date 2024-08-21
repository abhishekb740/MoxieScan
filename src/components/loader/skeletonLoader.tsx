const SkeletonLoader = ({ width = '100%', height = '1rem' }: { width?: string, height?: string }) => (
    <div className="animate-pulse bg-gray-700" style={{ width, height }}></div>
  );
  
  export default SkeletonLoader;
  