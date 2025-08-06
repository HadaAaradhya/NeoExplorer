import React, { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { FloatingParticles } from "../components/FloatingParticles";
import ShootingStars from "../components/ShootingStars";
import CustomCursor from "../components/CustomCursor";
import TopNavbar from "../components/TopNavbar";


// Use environment variable for NASA API key (see .env setup)
const API_KEY = import.meta.env.VITE_NASA_API_KEY;

export default function Dashboard() {
  // --- Date Format Helpers ---
  function toISODate(ddmmyyyy: string) {
    // Convert dd/mm/yyyy to yyyy-mm-dd
    const [dd, mm, yyyy] = ddmmyyyy.split('/');
    return `${yyyy}-${mm}-${dd}`;
  }
  function toDDMMYYYY(iso: string) {
    // Convert yyyy-mm-dd to dd/mm/yyyy
    const [yyyy, mm, dd] = iso.split('-');
    return `${dd}/${mm}/${yyyy}`;
  }
  const { user } = useAuth();
  const navigate = useNavigate();

  // Filters & Sorting
  const [filterHazard, setFilterHazard] = useState('all');
  const [sortBy, setSortBy] = useState('approach');
  const [dateRange, setDateRange] = useState({ start: '2024-01-15', end: '2024-01-22' });
  // Store pendingDateRange in dd/mm/yyyy format for user input
  const [pendingDateRange, setPendingDateRange] = useState({ start: toDDMMYYYY('2024-01-15'), end: toDDMMYYYY('2024-01-22') });
  const [showWarning, setShowWarning] = useState(false);
  const [searchTriggered, setSearchTriggered] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;



// --- Types ---
  type NEO = {
    id: string;
    name: string;
    approach: string;
    velocity: string;
    diameter: string;
    hazardous: boolean;
    nasa_jpl_url: string;
    close_approach_data: Array<{
      relative_velocity: { kilometers_per_second: string };
    }>;
    estimated_diameter: {
      meters: {
        estimated_diameter_min: number;
        estimated_diameter_max: number;
      };
    };
    is_potentially_hazardous_asteroid: boolean;
    favorited?: boolean;
  };

  // --- State ---
  const [asteroids, setAsteroids] = useState<NEO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalAsteroid, setModalAsteroid] = useState<NEO | null>(null);
  const [barData, setBarData] = useState<{ date: string; count: number }[]>([]);
  const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);
  const pieColors = ['#f87171', '#38bdf8'];
  const [liveFeed, setLiveFeed] = useState<{ message: string; type: string }>({ message: '', type: 'info' });

  // Fetch NEO data from NASA API
  useEffect(() => {
    // Show warning if date range > 7 days
    // Convert dd/mm/yyyy to Date
    const [sd, sm, sy] = pendingDateRange.start.split('/');
    const [ed, em, ey] = pendingDateRange.end.split('/');
    const start = new Date(`${sy}-${sm}-${sd}`);
    const end = new Date(`${ey}-${em}-${ed}`);
    const diffDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
    setShowWarning(diffDays > 7);
  }, [pendingDateRange]);

  useEffect(() => {
    if (!searchTriggered) return;
    async function fetchNEO() {
      setLoading(true);
      setError(null);
      setAsteroids([]);
      setBarData([]);
      setPieData([]);
      setLiveFeed({ message: '', type: 'info' });
      try {
        const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${dateRange.start}&end_date=${dateRange.end}&api_key=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error?.message || 'Failed to fetch NEO data');
        }
        // Flatten all asteroids into a single array
        const allAsteroids: NEO[] = [];
        // The NASA API returns near_earth_objects as Record<string, NEO[]>
        const neoObj = data.near_earth_objects as Record<string, NEO[]>;
        Object.entries(neoObj).forEach(([date, arr]) => {
          arr.forEach((a) => {
            allAsteroids.push({
              ...a,
              approach: date,
              velocity: a.close_approach_data[0]?.relative_velocity?.kilometers_per_second || '--',
              diameter: `${a.estimated_diameter.meters.estimated_diameter_min.toFixed(1)} - ${a.estimated_diameter.meters.estimated_diameter_max.toFixed(1)}`,
              hazardous: a.is_potentially_hazardous_asteroid,
              nasa_jpl_url: a.nasa_jpl_url,
            });
          });
        });
        setAsteroids(allAsteroids);
        // Bar chart: asteroids per day
        const bar = Object.entries(neoObj).map(([date, arr]) => ({ date, count: arr.length }));
        setBarData(bar);
        // Pie chart: hazardous vs non-hazardous
        let hazardous = 0, nonHazardous = 0;
        allAsteroids.forEach(a => a.hazardous ? hazardous++ : nonHazardous++);
        setPieData([
          { name: 'Hazardous', value: hazardous },
          { name: 'Non-Hazardous', value: nonHazardous },
        ]);
        // Live feed: show the closest approach or hazardous object
        const hazardousAsteroids = allAsteroids.filter(a => a.hazardous);
        if (hazardousAsteroids.length > 0) {
          const closest = hazardousAsteroids[0];
          setLiveFeed({
            message: `Hazardous: ${closest.name} approaches on ${closest.approach} at ${parseFloat(closest.velocity).toFixed(2)} km/s!`,
            type: 'hazard',
          });
        } else if (allAsteroids.length > 0) {
          const soonest = allAsteroids[0];
          setLiveFeed({
            message: `Closest approach: ${soonest.name} on ${soonest.approach} at ${parseFloat(soonest.velocity).toFixed(2)} km/s`,
            type: 'info',
          });
        } else {
          setLiveFeed({ message: 'No asteroids found for this range.', type: 'info' });
        }
      } catch (err) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
        setSearchTriggered(false);
      }
    }
    fetchNEO();
  }, [searchTriggered, dateRange]);

  // Apply filters
  let filteredAsteroids = asteroids.filter(a => {
    if (filterHazard === 'hazard' && !a.hazardous) return false;
    if (filterHazard === 'safe' && a.hazardous) return false;
    if (dateRange.start && a.approach < dateRange.start) return false;
    if (dateRange.end && a.approach > dateRange.end) return false;
    return true;
  });
  
  // --- Derived Stats for Cards ---
  // Only calculate if there are asteroids
  let fastestAsteroid = null, closestAsteroid = null, avgSize = null;
  if (filteredAsteroids.length > 0) {
    fastestAsteroid = filteredAsteroids.reduce((max, a) => parseFloat(a.velocity) > parseFloat(max.velocity) ? a : max, filteredAsteroids[0]);
    closestAsteroid = filteredAsteroids.reduce((min, a) => new Date(a.approach) < new Date(min.approach) ? a : min, filteredAsteroids[0]);
    const sizes = filteredAsteroids.map(a => {
      const [min, max] = a.diameter.split(' - ').map(Number);
      return (min + max) / 2;
    });
    avgSize = (sizes.reduce((sum, s) => sum + s, 0) / sizes.length).toFixed(2);
  }
  // Apply sorting
  filteredAsteroids = [...filteredAsteroids].sort((a, b) => {
    if (sortBy === 'approach') return a.approach.localeCompare(b.approach);
    if (sortBy === 'velocity') return parseFloat(b.velocity) - parseFloat(a.velocity);
    if (sortBy === 'size') {
      // Sort by max diameter
      const aMax = parseFloat(a.diameter.split(' - ')[1]);
      const bMax = parseFloat(b.diameter.split(' - ')[1]);
      return bMax - aMax;
    }
    return 0;
  });

  // Pagination logic (after filteredAsteroids is defined)
  const totalPages = Math.ceil(filteredAsteroids.length / rowsPerPage);
  const paginatedAsteroids = filteredAsteroids.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <section id="dashboard" className="py-24 bg-slate-950 min-h-screen relative overflow-hidden">
      <TopNavbar />
      <FloatingParticles />
      <ShootingStars />
      <CustomCursor />
      {/* Live NASA Feed Banner */}
      <div className={`w-full py-2 px-4 text-center font-semibold text-white ${liveFeed.type === 'hazard' ? 'bg-gradient-to-r from-red-900 via-red-700 to-red-900 animate-pulse' : 'bg-gradient-to-r from-sky-900 via-blue-800 to-sky-900'}`}
        style={{ position: 'fixed', top: 0, left: 0, zIndex: 40 }}>
        {liveFeed.message}
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-white tracking-tight">
            Mission Control
          </h2>
          <p className="text-slate-400 text-xl font-light max-w-3xl mx-auto leading-relaxed">
            Monitor asteroid activity and analyze trends from your unified command center
          </p>
        </div>
        {/* Stats Summary Cards */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-4">
          <div className="bg-slate-900/80 rounded-xl px-8 py-6 flex flex-col items-center border border-slate-700 min-w-[180px]">
            <div className="text-3xl font-bold text-sky-400">{asteroids.length}</div>
            <div className="text-sm text-slate-400 mt-1">Asteroids Found</div>
          </div>
          <div className="bg-slate-900/80 rounded-xl px-8 py-6 flex flex-col items-center border border-slate-700 min-w-[180px]">
            <div className="text-3xl font-bold text-red-400">{asteroids.filter(a => a.hazardous).length}</div>
            <div className="text-sm text-slate-400 mt-1">Hazardous</div>
          </div>
          <div className="bg-slate-900/80 rounded-xl px-8 py-6 flex flex-col items-center border border-slate-700 min-w-[180px]">
            <div className="text-3xl font-bold text-green-400">{asteroids.filter(a => !a.hazardous).length}</div>
            <div className="text-sm text-slate-400 mt-1">Safe</div>
          </div>
        </div>
        {/* Fastest, Closest, and Average Size Asteroid Cards */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-10">
          {/* Fastest Asteroid Card */}
          {fastestAsteroid && (
            <div className="bg-slate-900/80 rounded-xl px-8 py-6 flex flex-col items-center border border-yellow-700 min-w-[180px]">
              <div className="text-3xl font-bold text-yellow-400">{parseFloat(fastestAsteroid.velocity).toFixed(2)} km/s</div>
              <div className="text-sm text-slate-400 mt-1">Fastest Asteroid</div>
              <div className="text-xs text-slate-500 mt-1">{fastestAsteroid.name}</div>
            </div>
          )}
          {/* Closest Asteroid Card */}
          {closestAsteroid && (
            <div className="bg-slate-900/80 rounded-xl px-8 py-6 flex flex-col items-center border border-blue-700 min-w-[180px]">
              <div className="text-3xl font-bold text-blue-400">{toDDMMYYYY(closestAsteroid.approach)}</div>
              <div className="text-sm text-slate-400 mt-1">Closest Approach</div>
              <div className="text-xs text-slate-500 mt-1">{closestAsteroid.name}</div>
            </div>
          )}
          {/* Average Size Card */}
          {avgSize && (
            <div className="bg-slate-900/80 rounded-xl px-8 py-6 flex flex-col items-center border border-green-700 min-w-[180px]">
              <div className="text-3xl font-bold text-green-400">{avgSize} m</div>
              <div className="text-sm text-slate-400 mt-1">Average Size</div>
            </div>
          )}
        </div>
        <Card className="bg-gradient-to-br from-sky-900/20 to-indigo-900/20 backdrop-blur-sm border border-slate-700/20">
          <div className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-2xl font-bold text-white mb-2">
                  Welcome back, {user ? user.displayName || "Explorer" : "Commander"}
                </div>
                <p className="text-slate-400">Last updated: {new Date().toLocaleString()}</p>
              </div>
              <div className="flex gap-3 mt-4 lg:mt-0">
                {user ? (
                  <Button variant="outline" className="bg-sky-500/20 hover:bg-sky-500/30 border-sky-500/50 text-white">
                    <span className="mr-2">🔄</span>Refresh
                  </Button>
                ) : (
                  <Button className="bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/50 text-white">
                    <span className="mr-2">🔐</span>Sign in to Access
                  </Button>
                )}
              </div>
            </div>
            {/* No more mock stats cards. You can add real stats here if desired, e.g. total asteroids, hazardous count, avg diameter, using the real data. */}
            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-6 mt-8">
              <Card className="bg-sky-900/30 border-slate-700/20">
                <div className="p-4">
                  <div className="text-lg font-semibold text-white flex items-center mb-2">
                    <span className="mr-2 text-indigo-400">📊</span>
                    Daily Asteroid Count
                  </div>
                  <div className="h-64 bg-slate-900/30 rounded-lg flex items-center justify-center text-slate-400">
                    {loading ? (
                      <span className="inline-block w-8 h-8 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></span>
                    ) : error ? (
                      <span className="text-red-400">{error}</span>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                          <XAxis dataKey="date" stroke="#38bdf8" fontSize={12} tick={{ fill: '#38bdf8' }} />
                          <YAxis stroke="#f87171" fontSize={12} tick={{ fill: '#f87171' }} />
                          <RechartsTooltip />
                          <Bar dataKey="count" fill="#a78bfa" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </Card>
              <Card className="bg-sky-900/30 border-slate-700/20">
                <div className="p-4">
                  <div className="text-lg font-semibold text-white flex items-center mb-2">
                    <span className="mr-2 text-sky-400">🥧</span>
                    Hazard Classification
                  </div>
                  <div className="h-64 bg-slate-900/30 rounded-lg flex items-center justify-center text-slate-400">
                    {loading ? (
                      <span className="inline-block w-8 h-8 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></span>
                    ) : error ? (
                      <span className="text-red-400">{error}</span>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {pieData.map((entry, idx) => (
                              <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                            ))}
                          </Pie>
                          <Legend />
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </Card>
            </div>
            {/* Filters & Sorting */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-8 mb-4">
              <div className="flex gap-2 items-center">
                <label className="text-slate-400">Hazard:</label>
                <select value={filterHazard} onChange={e => setFilterHazard(e.target.value)} className="rounded bg-slate-900 text-white px-2 py-1 border border-slate-700">
                  <option value="all">All</option>
                  <option value="hazard">Hazardous</option>
                  <option value="safe">Safe</option>
                </select>
                <label className="ml-4 text-slate-400">Sort by:</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="rounded bg-slate-900 text-white px-2 py-1 border border-slate-700">
                  <option value="approach">Approach Date</option>
                  <option value="velocity">Velocity</option>
                  <option value="size">Size</option>
                </select>
              </div>
              <div className="flex gap-2 items-center">
                <label className="text-slate-400">Date Range:</label>
                <input type="date" value={pendingDateRange.start} onChange={e => setPendingDateRange(r => ({ ...r, start: e.target.value }))} className="rounded bg-slate-900 text-white px-2 py-1 border border-slate-700" />
                <span className="text-slate-400">to</span>
                <input type="date" value={pendingDateRange.end} onChange={e => setPendingDateRange(r => ({ ...r, end: e.target.value }))} className="rounded bg-slate-900 text-white px-2 py-1 border border-slate-700" />
                <Button
                  variant="outline"
                  className="ml-2"
                  onClick={() => {
                    setDateRange({ ...pendingDateRange });
                    setSearchTriggered(true);
                  }}
                >
                  Submit
                </Button>
              </div>
            </div>
            {/* Asteroid List */}
            <Card className="bg-sky-900/30 border-slate-700/20 mt-4">
              <div className="p-4">
                <div className="text-lg font-semibold text-white flex items-center mb-2">
                  <span className="mr-2 text-green-400">📋</span>
                  Recent Asteroid Observations
                </div>
                <div className="space-y-3">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <span className="inline-block w-8 h-8 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></span>
                    </div>
                  ) : error ? (
                    <div className="flex items-center justify-center py-8 text-red-400">{error}</div>
                  ) : filteredAsteroids.length === 0 ? (
                    <div className="flex items-center justify-center py-8 text-slate-400">No asteroids found for this range.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-slate-900/50 rounded-lg">
                        <thead>
                          <tr className="text-white text-left">
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Diameter (m)</th>
                            <th className="px-4 py-2">Velocity (km/s)</th>
                            <th className="px-4 py-2">Approach Date</th>
                            <th className="px-4 py-2">Hazardous</th>
                            <th className="px-4 py-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedAsteroids.map((asteroid, index) => (
                            <tr key={asteroid.id || index} className="border-b border-slate-700 hover:bg-slate-900/70 transition-colors cursor-pointer" onClick={() => setModalAsteroid(asteroid)}>
                              <td className="px-4 py-2 font-semibold text-white">{asteroid.name}</td>
                              <td className="px-4 py-2 text-slate-400">{asteroid.diameter}</td>
                              <td className="px-4 py-2 text-slate-400">{parseFloat(asteroid.velocity).toFixed(2)}</td>
                              <td className="px-4 py-2 text-slate-400">{toDDMMYYYY(asteroid.approach)}</td>
                              <td className="px-4 py-2">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  asteroid.hazardous
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-green-500/20 text-green-400"
                                }`}>
                                  {asteroid.hazardous ? "Hazardous" : "Safe"}
                                </span>
                              </td>
                              <td className="px-4 py-2 flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`${asteroid.favorited ? "text-yellow-500" : "text-gray-500"} hover:text-yellow-400`}
                                  disabled={!user}
                                >
                                  {asteroid.favorited ? "⭐" : "☆"}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-500 hover:text-blue-400"
                                  disabled={!user}
                                >
                                  👁️
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {/* Pagination Controls */}
                      {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                          >
                            Previous
                          </Button>
                          <span className="text-white font-inter text-sm">Page {currentPage} of {totalPages}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                          >
                            Next
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
            {showWarning && (
              <div className="mb-4 p-3 bg-yellow-900/80 text-yellow-300 rounded-lg text-center font-semibold">
                Warning: NASA API only supports a maximum 7-day search window. Please select a range of 7 days or less for best results.
              </div>
            )}
                </div>
              </div>
            </Card>
            {/* Asteroid Detail Modal */}
            {modalAsteroid && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                <div className="bg-slate-900 rounded-xl shadow-2xl p-8 max-w-md w-full border border-slate-700 relative animate-fade-in">
                  <button onClick={() => setModalAsteroid(null)} className="absolute top-2 right-2 text-slate-400 hover:text-red-400 text-2xl">&times;</button>
                  <h3 className="text-2xl font-bold text-white mb-2">{modalAsteroid.name}</h3>
                  <div className="text-slate-400 mb-2">Approach: {modalAsteroid.approach}</div>
                  <div className="text-slate-400 mb-2">Estimated Diameter: {modalAsteroid.diameter}</div>
                  <div className="text-slate-400 mb-2">Velocity: {parseFloat(modalAsteroid.velocity).toFixed(2)} km/s</div>
                  <div className="text-slate-400 mb-2">Hazardous: {modalAsteroid.hazardous ? 'Yes' : 'No'}</div>
                  <a href={modalAsteroid.nasa_jpl_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">View on NASA JPL</a>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
} 