const fs = require('fs');

let c = fs.readFileSync('client/components/Layout.tsx', 'utf8');

const regex = /\{auth\?\.user && auth\.user\.is_verified === false && !isSharePage && \([\s\S]*?<\/[ ]*div>\s*\)\}/;

const newBanner = `{auth?.user && auth.user.is_verified === false && !isSharePage && !isBannerDismissed && (
            <div className="relative bg-yellow-100 border-b border-yellow-200 text-yellow-800 px-4 py-3 text-center sm:text-sm text-xs pr-10">
              <span className="font-semibold mr-2">Please verify your email address.</span> 
              <button onClick={handleResend} disabled={resending} className="underline text-yellow-900 hover:text-yellow-700">
                {resending ? 'Sending...' : 'Click here to resend verification email'}
              </button>
              <button 
                onClick={() => setIsBannerDismissed(true)} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-800 hover:text-yellow-900 font-bold text-lg"
                aria-label="Dismiss"
              >
                &times;
              </button>
            </div>
          )}`;

c = c.replace(regex, newBanner);
fs.writeFileSync('client/components/Layout.tsx', c);