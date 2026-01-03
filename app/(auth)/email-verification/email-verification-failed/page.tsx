'use client';

import { ExpiryLinkIcon } from '@/components/svgs/ExpiryLinkIcon';

const VerificationPage = () => {
  return (
    <div className="flex flex-col justify-center items-center w-[480px]  px-4 gap-2  max-w-md">
      <div className="flex justify-center">
        <ExpiryLinkIcon className="!w-12 !h-12 text-secondary-500" />
      </div>
      <h1 className="text-text-950 font-semibold text-2xl text-center">Broken link!</h1>
      <p className="text-text-950 px-2 text-center font-normal   ">
        This link is not working anymore, please contact support.
      </p>
      <a
        href="https://kubegrade.com/company/contact-us/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 bg-secondary-500 text-text-50 py-2 px-4 rounded-lg w-full flex justify-center items-center"
      >
        Please Contact Customer Support
      </a>
    </div>
  );
};

export default VerificationPage;
