"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Papa from 'papaparse';
import _ from 'lodash';

const ElectionResults = () => {
  const [data, setData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/election_data.csv');
        const text = await response.text();
        
        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            // Filter out rows that aren't totals
            const totalRows = results.data.filter(row => row.TYPE === 'TOTAL');
            
            // Group by location and aggregate votes
            const locationData = _.groupBy(totalRows, 'LOCATION');
            
            const aggregatedData = _.mapValues(locationData, (locationRows) => ({
              trump: _.sumBy(locationRows, 'DONALD J TRUMP'),
              harris: _.sumBy(locationRows, 'KAMALA D HARRIS')
            }));

            const locList = Object.keys(aggregatedData).filter(loc => 
              !loc.startsWith('BALLOT GROUP') && loc !== ''
            ).sort();

            setLocations(locList);
            setSelectedLocation(locList[0]);
            setData(aggregatedData);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Error reading file:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatData = (locationData) => {
    if (!locationData) return [];
    
    return [
      { name: 'Harris', value: locationData.harris, color: '#0066CC' },
      { name: 'Trump', value: locationData.trump, color: '#CC0000' }
    ];
  };

  const calculatePercentage = (value, total) => {
    return ((value / total) * 100).toFixed(1) + '%';
  };

  const calculateMargin = (harris, trump) => {
    const diff = harris - trump;
    const leader = diff > 0 ? 'Harris' : 'Trump';
    const margin = Math.abs(diff);
    return `${leader} +${margin.toLocaleString()} votes`;
  };

  if (loading) {
    return <div className="p-4">Loading election data...</div>;
  }

  const currentData = formatData(data[selectedLocation]);
  const totalVotes = currentData.reduce((sum, item) => sum + item.value, 0);
  const margin = calculateMargin(data[selectedLocation].harris, data[selectedLocation].trump);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Los Angeles County 2024 presidential election results by neighborhood
        </CardTitle>
        <div className="mt-4">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="p-2 border rounded-md w-64"
          >
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={currentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={({ value }) => calculatePercentage(value, totalVotes)}
              >
                {currentData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [
                  `${value.toLocaleString()} votes (${calculatePercentage(value, totalVotes)})`,
                  'Results'
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-lg font-semibold">
            {selectedLocation} - Total Votes: {totalVotes.toLocaleString()}
          </p>
          <p className="text-lg font-medium">Margin: {margin}</p>
          {currentData.map((candidate) => (
  <div key={candidate.name} className="flex gap-2">
    <span style={{ color: candidate.color }} className="font-medium w-20">
      {candidate.name}:
    </span>
    <span>
      {candidate.value.toLocaleString()} votes 
      ({calculatePercentage(candidate.value, totalVotes)})
    </span>
  </div>
))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ElectionResults;