import type { Meeting } from './types';

export const mockMeetings: Meeting[] = [
  {
    id: 'meeting-1',
    title: 'Quarterly Strategy Review',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    status: 'completed',
    summaryPreview: 'Discussed Q3 goals, product roadmap, and marketing initiatives. Key decisions made on budget allocation.',
    transcript: 'Alice: Welcome everyone to the quarterly strategy review. Bob: Thanks Alice, excited to be here. ...',
    fullSummary: 'The quarterly strategy review focused on aligning Q3 goals across departments. The product roadmap was finalized, with key milestones set for new feature releases. Marketing initiatives for the upcoming quarter were presented, emphasizing digital channels. A significant portion of the meeting was dedicated to budget allocation, resulting in approved funding for critical projects.',
    actionItems: [
      { actionItem: 'Finalize Q3 budget report', assignee: 'Carol' },
      { actionItem: 'Draft proposal for new marketing campaign', assignee: 'Dave' },
    ],
  },
  {
    id: 'meeting-2',
    title: 'Project Phoenix Sprint Planning',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    status: 'completed',
    summaryPreview: 'Planned tasks for the next sprint. Addressed blockers and assigned story points.',
    transcript: 'Eve: Okay team, let\'s plan the next sprint for Project Phoenix. Frank: I can take on the UI components. ...',
  },
  {
    id: 'meeting-3',
    title: 'Client Onboarding - Acme Corp',
    date: new Date().toISOString(), // Today
    status: 'live',
    summaryPreview: 'Ongoing client onboarding session with Acme Corp. Discussing integration requirements.',
  },
  {
    id: 'meeting-4',
    title: 'Weekly Team Sync',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // In 3 days
    status: 'upcoming',
    summaryPreview: 'Regular team update meeting.',
  },
];
