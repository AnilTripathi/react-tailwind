interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 bg-white ${className}`}>
      {children}
    </div>
  );
};