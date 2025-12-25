import { cn } from "@/lib/utils";

interface PostImagesProps {
  images: string[];
  className?: string;
}

export function PostImages({ images, className }: PostImagesProps) {
  if (images.length === 0) return null;

  const gridClass = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-2",
    4: "grid-cols-2",
  }[Math.min(images.length, 4)];

  return (
    <div className={cn("grid gap-1 rounded-xl overflow-hidden", gridClass, className)}>
      {images.slice(0, 4).map((image, index) => (
        <div
          key={index}
          className={cn(
            "relative aspect-video bg-muted",
            images.length === 3 && index === 0 && "row-span-2 aspect-square"
          )}
        >
          <img
            src={image.startsWith("http") ? image : `/images/${image}`}
            alt={`Post image ${index + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
