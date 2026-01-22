import { useState, useEffect, useRef, useCallback } from "react";

function PromoCarousel({ banners, theme }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);

  const nextSlide = useCallback(() => {
  setCurrentIndex((prev) =>
    prev === banners.length - 1 ? 0 : prev + 1
  );
}, [banners.length]);

const prevSlide = useCallback(() => {
  setCurrentIndex((prev) =>
    prev === 0 ? banners.length - 1 : prev - 1
  );
}, [banners.length]);

const goToSlide = useCallback((index) => {
  setCurrentIndex(index);
}, []);


  useEffect(() => {
  if (isHovered) return;

  intervalRef.current = setInterval(() => {
    nextSlide();
  }, 4000);

  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
}, [isHovered, nextSlide]);


  const styles = {
    container: {
      width: "100%",
      margin: "40px 0",
      position: "relative",
      overflow: "hidden",
      borderRadius: "15px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    },
    slider: {
      display: "flex",
      transition: "transform 0.5s ease-in-out",
      transform: `translateX(-${currentIndex * 100}%)`,
    },
    slide: {
      minWidth: "100%",
      position: "relative",
      height: "300px",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      textAlign: "center",
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 100%)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
    },
    title: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      margin: "0 0 10px 0",
      textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
    },
    subtitle: {
      fontSize: "1.2rem",
      margin: "0 0 15px 0",
      textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
    },
    badge: {
      background: "#ff6b35",
      color: "white",
      padding: "8px 16px",
      borderRadius: "25px",
      fontSize: "1rem",
      fontWeight: "bold",
      textShadow: "none",
      display: "inline-block",
    },
    arrow: {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      background: "rgba(255,255,255,0.2)",
      border: "none",
      color: "white",
      fontSize: "2rem",
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background 0.3s",
      zIndex: 10,
    },
    arrowLeft: {
      left: "20px",
    },
    arrowRight: {
      right: "20px",
    },
    dots: {
      position: "absolute",
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      gap: "10px",
    },
    dot: {
      width: "12px",
      height: "12px",
      borderRadius: "50%",
      background: "rgba(255,255,255,0.5)",
      cursor: "pointer",
      transition: "background 0.3s",
    },
    dotActive: {
      background: "white",
    },
  };

  return (
    <div
      style={styles.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.slider}>
        {banners.map((banner, index) => (
          <div
            key={index}
            style={{
              ...styles.slide,
              backgroundImage: `url(${banner.image_url})`,
            }}
          >
            <div style={styles.overlay}>
              <h2 style={styles.title}>{banner.title}</h2>
              <p style={styles.subtitle}>{banner.subtitle}</p>
              {banner.badge && <div style={styles.badge}>{banner.badge}</div>}
            </div>
          </div>
        ))}
      </div>

      <button
        style={{ ...styles.arrow, ...styles.arrowLeft }}
        onClick={prevSlide}
      >
        ‹
      </button>
      <button
        style={{ ...styles.arrow, ...styles.arrowRight }}
        onClick={nextSlide}
      >
        ›
      </button>

      <div style={styles.dots}>
        {banners.map((_, index) => (
          <div
            key={index}
            style={{
              ...styles.dot,
              ...(index === currentIndex ? styles.dotActive : {}),
            }}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default PromoCarousel;