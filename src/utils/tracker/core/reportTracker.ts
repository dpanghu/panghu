import { report } from '@/services/tracker';
import type { TrackerDataType } from './typings';

export function reportTracker(url: string, data: TrackerDataType) {
  report(url, data);
}
