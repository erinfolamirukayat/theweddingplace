import React from 'react';
import { Link } from 'react-router-dom';

const HowItWorks = () => (
  <div className="max-w-3xl mx-auto py-10 px-4">
    <h1 className="text-3xl font-bold mb-6 text-[#2C1810]">How It Works</h1>
    <ol className="list-decimal ml-6 space-y-6 text-lg">
      <li>
        <span className="font-semibold">Create your registry &amp; add items:</span> <br />
        Start by creating your wedding registry and adding the items you'd love to receive.
      </li>
      <li>
        <span className="font-semibold">Share your registry link with loved ones:</span> <br />
        Send your unique registry link to friends and family so they can contribute to your dream home.
      </li>
      <li>
        <span className="font-semibold">Redeem your gifts:</span>
        <div className="mt-2 ml-2">
          <p>There are <span className="font-semibold">three main ways</span> to redeem your gifts:</p>
          <ol className="list-decimal ml-6 mt-2 space-y-2">
            <li>
              <span className="font-semibold">Get every contribution into your account as cash (immediately):</span> <br />
              As contributions come in, they are sent directly to your account. <br />
              <span className="text-sm text-gray-600">Note: While this is convenient, you may not be able to make account for all the money, and you might not maximize the purpose of the registry, which is to help you set up a beautiful home with your spouse.</span>
            </li>
            <li>
              <span className="font-semibold">Get all contributions as cash after your wedding day:</span> <br />
              You can choose to receive all contributions at once, on or after your wedding day. You'll set a date and provide your account information upfront or when the date is approaching. <br />
              <span className="text-sm text-gray-600">This maximizes the registry's purpose, but you may not end up spending all the cash for setting up your home as you envisioned when creating the registry.</span>
            </li>
            <li>
              <span className="font-semibold">Physical gifts delivered:</span> <br />
              We deliver the items in your registry that have been paid for, on the date you select. <br />
              <span className="text-sm text-gray-600">This is very flexible: if you no longer need an item that has been paid for, you can swap it for a different item. The items in your registry are not set in stone—we can work with you to update, remove, or add items. Just contact us; we are very responsive. This maximizes the power of a registry, you set up your home just as you envisioned from the start.</span>
            </li>
          </ol>
        </div>
        <div className="mt-4">
          <span className="font-semibold">Flexibility:</span> <br />
          You can choose to get some items delivered and receive the remaining contributions as cash. Flexibility is our watchword!
        </div>
      </li>
    </ol>
    <div className="mt-8 text-center">
      <Link to="/create-registry" className="inline-block px-6 py-3 bg-[#B8860B] text-white rounded hover:bg-[#8B6508] font-semibold">Start Your Registry</Link>
    </div>
  </div>
);

export default HowItWorks; 