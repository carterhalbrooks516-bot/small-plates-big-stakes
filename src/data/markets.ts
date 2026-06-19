import type { Poll } from '../types';

/**
 * The full slate of prediction markets.
 *
 * These ids MUST match the rows you seed into Supabase (see the SQL in the
 * README). Editing a label here is purely cosmetic; editing an `id` means you
 * also need to update the corresponding row in the database.
 *
 * IMPORTANT: every option `id` must be GLOBALLY unique (it is the primary key
 * of the `options` table in Supabase), which is why they're prefixed with their
 * poll id. The whole UI is data-driven off this array — add a market by
 * appending an object here and inserting the matching DB rows.
 */
export const MARKETS: Poll[] = [
  {
    id: 'venue',
    title: 'Tapas Location Intelligence',
    question: 'Where is the date?',
    icon: '🍷',
    summaryLabel: 'Favorite Venue',
    options: [
      { id: 'venue-cafe-madrid', label: 'Cafe Madrid' },
      { id: 'venue-barcelona', label: 'Barcelona Wine Bar' },
      { id: 'venue-mystery', label: 'Mystery third place, Andrew lied' },
      { id: 'venue-chips-salsa', label: 'He said tapas but meant chips and salsa' },
    ],
  },
  {
    id: 'start-time',
    title: 'First Contact Window',
    question: 'What time does the date start?',
    icon: '🕕',
    summaryLabel: 'Projected Start',
    options: [
      { id: 'start-time-6pm', label: '6:00 PM, aggressive adult behavior' },
      { id: 'start-time-630pm', label: '6:30 PM, respectable' },
      { id: 'start-time-7pm', label: '7:00 PM, classic first date' },
      { id: 'start-time-730pm', label: '7:30 PM, Andrew needed extra mirror time' },
      { id: 'start-time-8pm', label: '8:00 PM or later, tapas after dark' },
    ],
  },
  {
    id: 'duration',
    title: 'Date Duration Market',
    question: 'How long will it last?',
    icon: '⏱️',
    summaryLabel: 'Projected Length',
    options: [
      { id: 'duration-under-60', label: 'Under 60 minutes, she has “an early morning”' },
      { id: 'duration-1-1p5', label: '1 to 1.5 hours, polite but no sparks' },
      { id: 'duration-1p5-2p5', label: '1.5 to 2.5 hours, solid outing' },
      { id: 'duration-2p5-plus', label: '2.5+ hours, Andrew is cooking' },
      { id: 'duration-4-plus', label: '4+ hours, start looking at wedding venues' },
    ],
  },
  {
    id: 'drinks',
    title: 'Andrew Beverage Index',
    question: 'How many drinks will Andrew have?',
    icon: '🍸',
    summaryLabel: 'Projected Drinks',
    options: [
      { id: 'drinks-0', label: '0, suspicious discipline' },
      { id: 'drinks-1', label: '1, gentleman mode' },
      { id: 'drinks-2', label: '2, optimal operating range' },
      { id: 'drinks-3', label: '3, story-repeat danger zone' },
      { id: 'drinks-4-plus', label: '4+, the group chat needs to intervene' },
    ],
  },
  {
    id: 'opening-line',
    title: 'Opening Line Roulette',
    question: 'What will Andrew’s opening line be?',
    icon: '🎙️',
    summaryLabel: 'Most Feared Line',
    options: [
      { id: 'opening-line-smart', label: '“I heard you’re smart.”' },
      { id: 'opening-line-like-tapas', label: '“So do you like tapas?”' },
      {
        id: 'opening-line-never-been',
        label: '“I’ve actually never been here, but I’ve heard things.”',
      },
      {
        id: 'opening-line-pictures',
        label: '“You look exactly like your pictures, which is good.”',
      },
      { id: 'opening-line-not-weird', label: '“I was told not to say anything weird.”' },
      { id: 'opening-line-parking', label: '“How was parking?”' },
      {
        id: 'opening-line-45-minutes',
        label: '“I’m not usually awkward, this is just the first 45 minutes.”',
      },
      { id: 'opening-line-your-story', label: '“So what’s your story?”' },
    ],
  },
  {
    id: 'second-date',
    title: 'Second Date Probability',
    question: 'Will there be a second date?',
    icon: '📈',
    summaryLabel: 'Second Date Odds',
    options: [
      { id: 'second-date-yes', label: 'Yes, book it' },
      { id: 'second-date-maybe', label: 'Maybe, depends on dessert' },
      { id: 'second-date-no-educational', label: 'No, but it was educational' },
      { id: 'second-date-business-days', label: 'Linley will need 3 to 5 business days' },
      { id: 'second-date-andrew-claims', label: 'Andrew will claim it went great regardless' },
    ],
  },
  {
    id: 'mrs-stephens',
    title: 'Long-Term Futures Market',
    question: 'Is this the future Mrs. Andrew Stephens?',
    icon: '💍',
    summaryLabel: 'Mrs. Stephens Futures',
    options: [
      { id: 'mrs-stephens-loading', label: 'Yes, Mrs. Stephens loading' },
      { id: 'mrs-stephens-upside', label: 'Too early, but the board likes the upside' },
      { id: 'mrs-stephens-group-lore', label: 'No, but she will become group lore' },
      { id: 'mrs-stephens-6-weeks', label: 'They’ll date for 6 weeks and confuse everyone' },
      { id: 'mrs-stephens-fumbles', label: 'Andrew fumbles the franchise' },
    ],
  },
];

/** Fast lookup by id. */
export const MARKETS_BY_ID: Record<string, Poll> = Object.fromEntries(
  MARKETS.map((m) => [m.id, m]),
);
