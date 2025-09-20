export interface YouTubeVideo {
  id: string;
  title: string;
  guestName: string;
  abstract: string;
  thumbnail: string;
  publishedAt: string;
  url: string;
}

export const youtubeService = {
  getChannelVideos: async (maxResults: number = 12): Promise<YouTubeVideo[]> => {
    // Return manual video list with the provided YouTube links
    const videos: YouTubeVideo[] = [
      {
        id: 'MVmgD0GmN1c',
        title: 'Olga Shumylo',
        guestName: 'Olga Shumylo',
        abstract: '',
        thumbnail: 'https://img.youtube.com/vi/MVmgD0GmN1c/maxresdefault.jpg',
        publishedAt: '2024-01-08T00:00:00Z',
        url: 'https://www.youtube.com/watch?v=MVmgD0GmN1c'
      },
      {
        id: 'JXsssu5gXxU',
        title: 'Dr. Amina Hassan',
        guestName: 'Dr. Amina Hassan',
        abstract: '',
        thumbnail: 'https://img.youtube.com/vi/JXsssu5gXxU/maxresdefault.jpg',
        publishedAt: '2024-01-07T00:00:00Z',
        url: 'https://www.youtube.com/watch?v=JXsssu5gXxU'
      },
      {
        id: '62zZfHDpv1I',
        title: 'Samuel Ochieng',
        guestName: 'Samuel Ochieng',
        abstract: '',
        thumbnail: 'https://img.youtube.com/vi/62zZfHDpv1I/maxresdefault.jpg',
        publishedAt: '2024-01-06T00:00:00Z',
        url: 'https://www.youtube.com/watch?v=62zZfHDpv1I'
      },
      {
        id: 'A3JDzAxTBkg',
        title: 'Grace Mutindi',
        guestName: 'Grace Mutindi',
        abstract: '',
        thumbnail: 'https://img.youtube.com/vi/A3JDzAxTBkg/maxresdefault.jpg',
        publishedAt: '2024-01-05T00:00:00Z',
        url: 'https://www.youtube.com/watch?v=A3JDzAxTBkg'
      },
      {
        id: 'Sbnk3Me0AMc',
        title: 'Michael Kiprop',
        guestName: 'Michael Kiprop',
        abstract: '',
        thumbnail: 'https://img.youtube.com/vi/Sbnk3Me0AMc/maxresdefault.jpg',
        publishedAt: '2024-01-04T00:00:00Z',
        url: 'https://www.youtube.com/watch?v=Sbnk3Me0AMc'
      },
      {
        id: 'Qle8TPMJK60',
        title: 'Fatima Al-Rashid',
        guestName: 'Fatima Al-Rashid',
        abstract: '',
        thumbnail: 'https://img.youtube.com/vi/Qle8TPMJK60/maxresdefault.jpg',
        publishedAt: '2024-01-03T00:00:00Z',
        url: 'https://www.youtube.com/watch?v=Qle8TPMJK60'
      },
      {
        id: 'yHI7aJENqMo',
        title: 'Joseph Mbeki',
        guestName: 'Joseph Mbeki',
        abstract: '',
        thumbnail: 'https://img.youtube.com/vi/yHI7aJENqMo/maxresdefault.jpg',
        publishedAt: '2024-01-02T00:00:00Z',
        url: 'https://www.youtube.com/watch?v=yHI7aJENqMo'
      },
      {
        id: 'I9FhbB0yRvI',
        title: 'Aisha Kone',
        guestName: 'Aisha Kone',
        abstract: '',
        thumbnail: 'https://img.youtube.com/vi/I9FhbB0yRvI/maxresdefault.jpg',
        publishedAt: '2024-01-01T00:00:00Z',
        url: 'https://www.youtube.com/watch?v=I9FhbB0yRvI'
      },
      {
        id: 'I9FhbB0yRvI',
        title: 'Aisha Kone',
        guestName: 'Aisha Kone',
        abstract: '',
        thumbnail: 'https://img.youtube.com/vi/I9FhbB0yRvI/maxresdefault.jpg',
        publishedAt: '2023-12-31T00:00:00Z',
        url: 'https://www.youtube.com/watch?v=I9FhbB0yRvI'
      }
    ];

    return videos.slice(0, maxResults);
  },

  getFallbackVideos: (): YouTubeVideo[] => {
    // Return the same videos as fallback
    return youtubeService.getChannelVideos(12) as any;
  }
};