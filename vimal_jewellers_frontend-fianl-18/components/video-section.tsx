"use client";
import React, { useState } from 'react';

interface Video {
    id: number;
    title: string;
    youtubeUrl: string | null;
    videoFile: string | null;
}

interface VideoSectionProps {
    videos: Video[];
}

export const VideoSection: React.FC<VideoSectionProps> = ({ videos }) => {
    const [currentVideo, setCurrentVideo] = useState<Video>(videos[0]);

    const getVideoSrc = (video: Video) => {
        const isYoutube = video.youtubeUrl && !video.videoFile;
        let videoSrc = video.videoFile;
        let type = 'file';

        if (isYoutube && video.youtubeUrl) {
            const videoIdMatch = video.youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([^#&?]*).*/);
            const videoId = videoIdMatch ? videoIdMatch[1] : null;
            if (videoId) {
                videoSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                type = 'youtube';
            }
        }
        return { src: videoSrc, type };
    };

    const { src: activeSrc, type: activeType } = getVideoSrc(currentVideo);

    return (
        <section className="bg-black py-20 px-4 md:px-8 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-12 tracking-tight">Watch Our Latest Stories</h2>

            {/* Main Video Player */}
            <div className="max-w-6xl mx-auto mb-12">
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-gray-800 bg-gray-900">
                    {activeType === 'youtube' ? (
                        <iframe
                            key={currentVideo.id} // Re-render iframe on change
                            src={activeSrc || ""}
                            title={currentVideo.title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : activeSrc ? (
                        <video
                            key={currentVideo.id}
                            src={activeSrc}
                            controls
                            autoPlay // Optional: autoPlay when switching
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-500">Video Source Not Available</div>
                    )}
                </div>
                <h3 className="text-2xl font-bold mt-6 text-left">{currentVideo.title}</h3>
            </div>

            {/* Thumbnails List */}
            {videos.length > 1 && (
                <div className="max-w-6xl mx-auto">
                    <h4 className="text-left text-lg font-semibold mb-4 text-gray-400">More Videos</h4>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {videos.map((video) => {
                            const { src, type } = getVideoSrc(video);
                            const isActive = currentVideo.id === video.id;

                            // Get Thumbnail (For youtube we can get it, for file use a generic icon or video tag)
                            let thumb = null;
                            if (type === 'youtube' && video.youtubeUrl) {
                                const videoIdMatch = video.youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([^#&?]*).*/);
                                const videoId = videoIdMatch ? videoIdMatch[1] : null;
                                if (videoId) thumb = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
                            }

                            return (
                                <button
                                    key={video.id}
                                    onClick={() => setCurrentVideo(video)}
                                    className={`flex-shrink-0 w-64 flex flex-col items-start gap-2 group ${isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'} transition-opacity`}
                                >
                                    <div className={`relative w-full aspect-video rounded-xl overflow-hidden bg-gray-800 border-2 ${isActive ? 'border-primary' : 'border-transparent'}`}>
                                        {thumb ? (
                                            <img src={thumb} alt={video.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                                <span className="text-xs">Video File</span>
                                            </div>
                                        )}
                                        {/* Play Icon Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-colors">
                                            <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center border border-white/50">
                                                <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium text-left line-clamp-2 leading-tight">{video.title || "Untitled Video"}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </section>
    );
};
