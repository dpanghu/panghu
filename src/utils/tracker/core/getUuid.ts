import { v1 as uuidv1 } from 'uuid';
import { SEENTAO_TRACKER_UUID_KEY } from './constants';

export function getUuid(): string {
  let curUuid = sessionStorage.getItem(SEENTAO_TRACKER_UUID_KEY);
  if (!curUuid) {
    curUuid = uuidv1();
    sessionStorage.setItem(SEENTAO_TRACKER_UUID_KEY, curUuid);
  }
  return curUuid;
}
