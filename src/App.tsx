import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { Blocks, Clock, Hash, Database, Pause, Play } from 'lucide-react';

function App() {
  const [blockNumber, setBlockNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    const fetchBlockData = async () => {
      try {
        const provider =
          'https://lb.drpc.org/ogrpc?network=ethereum&dkey=AhU9-zEhlEpxt-NQ0HSStFnrz_8BknkR74T2Yuvy1U-i';
        const web3 = new Web3(new Web3.providers.HttpProvider(provider));
        const number = await web3.eth.getBlockNumber();
        setBlockNumber(number);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch block data');
        setLoading(false);
      }
    };

    fetchBlockData();
    let interval: number | undefined;

    if (autoRefresh) {
      interval = setInterval(fetchBlockData, 10000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const BlockCard = () => (
    <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Blocks className="w-8 h-8 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">Latest Block</h2>
        </div>
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
        >
          {autoRefresh ? (
            <Pause className="w-5 h-5 text-purple-600" />
          ) : (
            <Play className="w-5 h-5 text-purple-600" />
          )}
          <span className="text-sm text-purple-600 font-medium">
            {autoRefresh ? 'Pause' : 'Resume'}
          </span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
            <Database className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-500">Block Number</p>
              <p className="text-lg font-mono font-semibold text-purple-600">
                #{blockNumber?.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
            <Hash className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-500">Network</p>
              <p className="text-lg font-semibold text-purple-600">Ethereum</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Block Explorer
        </h1>
        <p className="text-gray-600">Real-time blockchain monitoring</p>
      </div>
      <BlockCard />
      <p className="mt-6 text-sm text-gray-500">
        {autoRefresh
          ? 'Auto-refreshes every 10 seconds'
          : 'Auto-refresh paused'}
      </p>
    </div>
  );
}

export default App;
