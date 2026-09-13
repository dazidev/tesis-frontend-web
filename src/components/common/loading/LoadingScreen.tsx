interface LoadingScreenProps {
  color?: string;
  backgroundColor?: string;
  text?: string;
}

export const LoadingScreen = ({
  color = "black",
  backgroundColor = "white",
  text = "Cargando...",
}: LoadingScreenProps) => {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 h-auto p-2"
      style={{ backgroundColor }}
    >
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200"
        style={{ borderTopColor: color }}
      />

      <span className="text-sm font-medium" style={{ color }}>
        {text}
      </span>
    </div>
  );
};
