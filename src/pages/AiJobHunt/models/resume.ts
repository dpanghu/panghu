import { useState } from 'react';

export default function ResumeStore() {
  const [employmentIntentionJson, setEmploymentIntentionJson] = useState([]);
  return { employmentIntentionJson, setEmploymentIntentionJson };
}
