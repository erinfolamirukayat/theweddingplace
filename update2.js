const fs = require('fs');
let c = fs.readFileSync('client/pages/CreateRegistry.tsx', 'utf8');
const searchBlock = `<div>
            <label htmlFor="couple_names" className="block text-sm font-medium text-gray-700">
              Couple Names
            </label>`;
            
const fullReplaceRegex = /<div>\s*<label htmlFor="couple_names"[\s\S]*?\{errors\.couple_names\}<\/p>\}\s*<\/div>/;

const r1 = `<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="partner_1" className="block text-sm font-medium text-gray-700">
                Bride / Partner 1
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HeartIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" name="partner_1" id="partner_1" value={formData.partner_1} onChange={handleChange} className={\`block w-full pl-10 pr-3 py-2 border \${errors.partner_1 ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-[#B8860B] focus:border-[#B8860B]\`} placeholder="e.g. Ada" />
              </div>
              {errors.partner_1 && <p className="mt-1 text-sm text-red-600">{errors.partner_1}</p>}
            </div>
            <div>
              <label htmlFor="partner_2" className="block text-sm font-medium text-gray-700">
                Groom / Partner 2
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HeartIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" name="partner_2" id="partner_2" value={formData.partner_2} onChange={handleChange} className={\`block w-full pl-10 pr-3 py-2 border \${errors.partner_2 ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-[#B8860B] focus:border-[#B8860B]\`} placeholder="e.g. Chinedu" />
              </div>
              {errors.partner_2 && <p className="mt-1 text-sm text-red-600">{errors.partner_2}</p>}
            </div>
          </div>`;

c = c.replace(fullReplaceRegex, r1);
fs.writeFileSync('client/pages/CreateRegistry.tsx', c);