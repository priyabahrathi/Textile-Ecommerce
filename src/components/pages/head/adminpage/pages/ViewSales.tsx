import React from 'react';

import { Card, CardContent, Typography, Grid } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend as RechartsLegend, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

const salesData = [
{ month: 'Jan', sales: 4000 },
{ month: 'Feb', sales: 3000 },
{ month: 'Mar', sales: 5000 },
{ month: 'Apr', sales: 4780 },
{ month: 'May', sales: 5890 },
{ month: 'Jun', sales: 4390 },
{ month: 'Jul', sales: 4490 },
];

const pieData = [
{ name: 'Online', value: 6000 },
{ name: 'In-Store', value: 4000 },
{ name: 'Wholesale', value: 2000 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const ViewSales: React.FC = () => {
return (
    <div style={{ padding: 24 }}>
        <Typography variant="h4" gutterBottom>
            Sales Overview
        </Typography>
        <Grid container spacing={4}>
            <Grid  component="div">
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Monthly Sales Trend
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <RechartsTooltip />
                                <Legend />
                                <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </Grid>
            <Grid   component="div">
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Sales Distribution
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={90}
                                    label
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                                <RechartsLegend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </div>
);
};

export default ViewSales;