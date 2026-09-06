import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  CheckCircle,
  Download,
  Settings,
  Sparkles
} from 'lucide-react';

const VideoPlayer = ({ videoUrl, title, onEnded, onMarkComplete, isCompleted }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('1080p');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration || 750);
    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [videoUrl]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const changeSpeed = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    setShowSpeedMenu(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16/9',
        background: '#000000',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)'
      }}
    >
      <video
        ref={videoRef}
        src={videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onClick={togglePlay}
        playsInline
      />

      {/* Big Center Play Button Overlay when paused */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.35)',
            cursor: 'pointer'
          }}
        >
          <div style={{
            width: 70,
            height: 70,
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(99, 102, 241, 0.6)',
            transform: 'scale(1)',
            transition: 'transform 0.2s'
          }}>
            <Play size={32} color="#ffffff" style={{ marginLeft: 4 }} />
          </div>
        </div>
      )}

      {/* Bottom Controls Bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '24px 20px 14px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)',
        opacity: showControls ? 1 : 0,
        transition: 'opacity 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}>
        {/* Scrub Slider */}
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          style={{
            width: '100%',
            accentColor: 'var(--accent)',
            cursor: 'pointer',
            height: 5,
            borderRadius: 3
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#ffffff', fontSize: 13 }}>
          {/* Left Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              onClick={togglePlay}
              style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            <button
              onClick={() => {
                if (videoRef.current) videoRef.current.currentTime = Math.max(0, currentTime - 10);
              }}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}
              title="Rewind 10s"
            >
              <RotateCcw size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={toggleMute}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              >
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                style={{ width: 60, accentColor: 'var(--accent)', height: 4 }}
              />
            </div>

            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-mono)' }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Speed Selector */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: 4,
                  cursor: 'pointer'
                }}
              >
                {playbackRate}x
              </button>
              {showSpeedMenu && (
                <div style={{
                  position: 'absolute',
                  bottom: 30,
                  right: 0,
                  background: 'rgba(17, 24, 39, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 6,
                  padding: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  border: '1px solid rgba(255,255,255,0.15)'
                }}>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                    <button
                      key={speed}
                      onClick={() => changeSpeed(speed)}
                      style={{
                        background: playbackRate === speed ? 'var(--accent-primary)' : 'transparent',
                        border: 'none',
                        color: '#fff',
                        padding: '4px 10px',
                        fontSize: 11,
                        cursor: 'pointer',
                        borderRadius: 4,
                        textAlign: 'center'
                      }}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quality Badge */}
            <span style={{
              background: 'rgba(255,255,255,0.15)',
              fontSize: 11,
              fontWeight: 700,
              padding: '3px 6px',
              borderRadius: 4
            }}>
              {quality}
            </span>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
