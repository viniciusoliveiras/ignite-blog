/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useEffect } from 'react';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default function Comments() {
  useEffect(() => {
    const script = document.createElement('script');
    const anchor = document.getElementById('inject-comments-for-uterances');

    script.setAttribute('src', 'https://utteranc.es/client.js');
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('async', 'true');
    script.setAttribute('repo', 'viniciusoliveiras/spacetraveling');
    script.setAttribute('issue-term', 'title');
    script.setAttribute('theme', 'photon-dark');
    anchor.appendChild(script);
  }, []);

  return <div id="inject-comments-for-uterances" />;
}
