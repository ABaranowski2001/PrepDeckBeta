/**
 * TestAdapter provides mock data for development and testing purposes
 * This allows frontend components to be tested without backend connectivity
 */

// Global state for test data usage
export let USE_TEST_DATA_VIDEOS = false;
export let USE_TEST_DATA_READS = false;

// Sample YouTube API response
export const sampleYouTubeAPIResponse = {
  "kind": "youtube#searchListResponse",
  "etag": "\"UCBpFjjqLQ5e9-pzRTC1qTQ-z5yef0f7\"",
  "nextPageToken": "CAoQAA",
  "regionCode": "US",
  "pageInfo": {
    "totalResults": 1000000,
    "resultsPerPage": 10
  },
  "items": [
    {
      "kind": "youtube#searchResult",
      "etag": "\"XpPGQXPnxQJhLgs6enD_n8JR4Qk/CtlLg3vRGmzAK_lFdmYnblSpclc\"",
      "id": {
        "kind": "youtube#video",
        "videoId": "dQw4w9WgXcQ"
      },
      "snippet": {
        "publishedAt": "2009-10-25T06:57:33.000Z",
        "channelId": "UCuAXFkgsw1L7xaCfnd5JJOw",
        "title": "Rick Astley - Never Gonna Give You Up (Official Music Video)",
        "description": "Official music video for Rick Astley - Never Gonna Give You Up (Video Taken From: Playlist: Best Of Rick Astley https://RickAstley.lnk.to/BestOf_RA Spotify ...",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
            "width": 480,
            "height": 360
          }
        },
        "channelTitle": "Rick Astley",
        "liveBroadcastContent": "none"
      }
    },
    {
      "kind": "youtube#searchResult",
      "etag": "\"XpPGQXPnxQJhLgs6enD_n8JR4Qk/RTQsxVC0-UiYU9FTFGZf53yHcH0\"",
      "id": {
        "kind": "youtube#video",
        "videoId": "fJ9rUzIMcZQ"
      },
      "snippet": {
        "publishedAt": "2008-08-01T11:06:40.000Z",
        "channelId": "UCiMhD4jzUqG-IgPzUmmytRQ",
        "title": "Queen – Bohemian Rhapsody (Official Video Remastered)",
        "description": "REMASTERED IN HD TO CELEBRATE ONE BILLION VIEWS! Taken from A Night At The Opera, 1975. Click here to buy the DVD with this video at the Official Queen ...",
        "thumbnails": {
          "default": {
            "url": "https://i.ytimg.com/vi/fJ9rUzIMcZQ/default.jpg",
            "width": 120,
            "height": 90
          },
          "medium": {
            "url": "https://i.ytimg.com/vi/fJ9rUzIMcZQ/mqdefault.jpg",
            "width": 320,
            "height": 180
          },
          "high": {
            "url": "https://i.ytimg.com/vi/fJ9rUzIMcZQ/hqdefault.jpg",
            "width": 480,
            "height": 360
          }
        },
        "channelTitle": "Queen Official",
        "liveBroadcastContent": "none"
      }
    }
  ]
};

// Sample flat video array (new format)
export const sampleFlatVideoArray = [
  {
    "videoId": "Wat-MR-uvv8",
    "title": "Security Forces Taser Training",
    "description": "Hey everyone! I got tased for the first time yesterday. I would say that getting tased is the second most painful thing I've ever ...",
    "thumbnail": "https://i.ytimg.com/vi/Wat-MR-uvv8/hqdefault.jpg",
    "publishedAt": "2020-10-17T11:29:07Z",
    "channelTitle": "Amber Kerry",
    "videoUrl": "https://www.youtube.com/watch?v=Wat-MR-uvv8"
  },
  {
    "videoId": "4Ira8ofidzI",
    "title": "Which Companies Are Known To Hire Formerly Incarcerated Individuals For Remote Work?",
    "description": "Which Companies Are Known To Hire Formerly Incarcerated Individuals For Remote Work? In this informative video, we will ...",
    "thumbnail": "https://i.ytimg.com/vi/4Ira8ofidzI/hqdefault.jpg",
    "publishedAt": "2025-04-14T00:01:58Z",
    "channelTitle": "Jail & Prison Insider",
    "videoUrl": "https://www.youtube.com/watch?v=4Ira8ofidzI"
  },
  {
    "videoId": "bMKTMVTb0kk",
    "title": "Watch a MASTER closer in action…",
    "description": "If you're looking for the BEST sales training videos on YouTube you've found it! If you want to make more Money selling cars ...",
    "thumbnail": "https://i.ytimg.com/vi/bMKTMVTb0kk/hqdefault.jpg",
    "publishedAt": "2023-05-18T15:12:53Z",
    "channelTitle": "Andy Elliott",
    "videoUrl": "https://www.youtube.com/watch?v=bMKTMVTb0kk"
  },
  {
    "videoId": "UXPE8A6crz8",
    "title": "Day 1 at Monroe Institute For Remote Viewing",
    "description": "Join this channel to get access to perks: https://www.youtube.com/channel/UCkoujZQZatbqy4KGcgjpVxQ/join Support the Shawn ...",
    "thumbnail": "https://i.ytimg.com/vi/UXPE8A6crz8/hqdefault.jpg",
    "publishedAt": "2023-10-19T15:00:20Z",
    "channelTitle": "Shawn Ryan Clips",
    "videoUrl": "https://www.youtube.com/watch?v=UXPE8A6crz8"
  }
];

// Sample Google Scholar-like data
export const sampleScholarAPIResponse = {
  "organic_results": [
    {
      "position": 1,
      "title": "The Theory of Everything: A Comprehensive Guide",
      "result_id": "1",
      "publication_info": {
        "summary": "Journal of Advanced Physics, 2021 - Cited by 145",
        "authors": ["A. Einstein", "M. Curie"]
      },
      "snippet": "This paper presents a unified theory of physics that attempts to combine quantum mechanics and general relativity into a comprehensive framework...",
      "link": "https://example.com/theory-of-everything",
      "year": 2021
    },
    {
      "position": 2,
      "title": "Machine Learning: Principles and Applications",
      "result_id": "2",
      "publication_info": {
        "summary": "MIT Press, 2020 - Cited by 320",
        "authors": ["A. Turing", "G. Hinton"]
      },
      "snippet": "A comprehensive introduction to machine learning concepts covering supervised, unsupervised, and reinforcement learning techniques...",
      "link": "https://example.com/machine-learning",
      "year": 2020
    }
  ],
  "related_searches": [
    {
      "query": "quantum computing applications"
    },
    {
      "query": "neural networks research"
    }
  ],
  "pagination": {
    "current": 1,
    "next": "https://scholar.google.com/scholar?start=10&q=artificial+intelligence&hl=en"
  }
};

// Sample pre-processed video data
export const sampleProcessedVideos = [
  {
    id: "dQw4w9WgXcQ",
    title: "Rick Astley - Never Gonna Give You Up (Official Music Video)",
    description: "Official music video for Rick Astley - Never Gonna Give You Up (Video Taken From: Playlist: Best Of Rick Astley)",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    publishedAt: "2009-10-25T06:57:33.000Z",
    channelTitle: "Rick Astley"
  },
  {
    id: "fJ9rUzIMcZQ",
    title: "Queen – Bohemian Rhapsody (Official Video Remastered)",
    description: "REMASTERED IN HD TO CELEBRATE ONE BILLION VIEWS! Taken from A Night At The Opera, 1975.",
    url: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
    thumbnailUrl: "https://i.ytimg.com/vi/fJ9rUzIMcZQ/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/fJ9rUzIMcZQ",
    publishedAt: "2008-08-01T11:06:40.000Z",
    channelTitle: "Queen Official"
  }
];

// Sample pre-processed text data
export const sampleProcessedTexts = [
  {
    id: "1",
    title: "The Theory of Everything: A Comprehensive Guide",
    description: "This paper presents a unified theory of physics that attempts to combine quantum mechanics and general relativity into a comprehensive framework...",
    url: "https://example.com/theory-of-everything",
    authors: ["A. Einstein", "M. Curie"],
    year: 2021,
    source: "Journal of Advanced Physics"
  },
  {
    id: "2",
    title: "Machine Learning: Principles and Applications",
    description: "A comprehensive introduction to machine learning concepts covering supervised, unsupervised, and reinforcement learning techniques...",
    url: "https://example.com/machine-learning",
    authors: ["A. Turing", "G. Hinton"],
    year: 2020,
    source: "MIT Press"
  }
];

/**
 * Mock adapter for Supabase
 * Creates mock responses that match the expected format in your hooks
 */
export class TestSupabaseAdapter {
  // Mock state to track what the adapter has done
  private state = {
    videoMocksEnabled: false,
    readMocksEnabled: false,
    useNewVideoFormat: true // By default, use the new flat video array format
  };

  // Enable video mocks for testing
  enableVideoMocks() {
    this.state.videoMocksEnabled = true;
    USE_TEST_DATA_VIDEOS = true;
    console.log('Test video data enabled globally');
    return this;
  }

  // Disable video mocks
  disableVideoMocks() {
    this.state.videoMocksEnabled = false;
    USE_TEST_DATA_VIDEOS = false;
    console.log('Test video data disabled globally');
    return this;
  }

  // Toggle which video format to use
  useVideoFormat(useNewFormat: boolean) {
    this.state.useNewVideoFormat = useNewFormat;
    return this;
  }

  // Enable read mocks for testing
  enableReadMocks() {
    this.state.readMocksEnabled = true;
    USE_TEST_DATA_READS = true;
    console.log('Test read data enabled globally');
    return this;
  }

  // Disable read mocks
  disableReadMocks() {
    this.state.readMocksEnabled = false;
    USE_TEST_DATA_READS = false;
    console.log('Test read data disabled globally');
    return this;
  }

  // Get mock data for the PDF Video table
  async getPDFVideoData() {
    if (!this.state.videoMocksEnabled) {
      return { data: [], error: null };
    }
    
    // Determine which format to use for testing
    const videoData = this.state.useNewVideoFormat ? 
      sampleFlatVideoArray :
      sampleYouTubeAPIResponse;
    
    return {
      data: [{ 
        "User_ID": "test-user-id",
        "File Name": "test-file.pdf",
        "Videos": JSON.stringify(videoData)
      }],
      error: null
    };
  }

  // Get mock data for the PDF Read table
  async getPDFReadData() {
    if (!this.state.readMocksEnabled) {
      return { data: [], error: null };
    }
    
    return {
      data: [{ 
        "User_ID": "test-user-id",
        "File Name": "test-file.pdf",
        "Reads": JSON.stringify(sampleScholarAPIResponse)
      }],
      error: null
    };
  }
}

// Export a singleton instance
export const testAdapter = new TestSupabaseAdapter(); 