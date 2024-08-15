import dayjs from 'dayjs';
import { isArray } from 'lodash';

export const getValueProps: (value: any) => Record<string, unknown> = (
  val: string,
) => {
  if (isArray(val)) {
    return {
      value: val.map((item) => {
        if (item) {
          if (item === '至今') {
            return dayjs();
          } else {
            return dayjs(item);
          }
        } else {
          return '';
        }
      }),
    };
  } else {
    if (val) {
      if (val === '至今') {
        return { value: dayjs() } as Record<string, unknown>;
      } else {
        return { value: dayjs(val) } as Record<string, unknown>;
      }
    } else {
      return {};
    }
  }
};

export const normalizeDate = (value: any) => {
  if (isArray(value)) {
    return value.map((item) => {
      if (item) {
        return `${dayjs(item).format('YYYY-MM').valueOf()}`;
      } else {
        return '';
      }
    });
  } else {
    return value && `${dayjs(value).format('YYYY-MM').valueOf()}`;
  }
};

// 处理日期字段
export const formatDateForForm = (
  values: Record<string, any>,
  params: string[],
) => {
  params.forEach((item) => {
    values[item].forEach((value: Record<string, any>) => {
      value.periodStart = value.rangeDate[0];
      value.periodEnd = value.rangeDate[1];
      delete value.rangeDate;
    });
  });
};
