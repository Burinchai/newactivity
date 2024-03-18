import React, { useState, useEffect } from 'react';

function ToContract() {
    const [data, setData] = useState([]);
    const [students, setStudents] = useState([]);
    const [activity, setActivity] = useState([]);
    const [actIDCounts, setActIDCounts] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const manageResponse = await fetch('http://localhost:3333/getManage');
                if (!manageResponse.ok) {
                    throw new Error('Failed to fetch data');
                }
                const manageData = await manageResponse.json();
                setData(manageData);

                const studentResponse = await fetch('http://localhost:3333/getStudent');
                if (!studentResponse.ok) {
                    throw new Error('Failed to fetch student data');
                }
                const studentData = await studentResponse.json();
                setStudents(studentData);

                const activityResponse = await fetch('http://localhost:3333/getActivity');
                if (!studentResponse.ok) {
                    throw new Error('Failed to fetch student data');
                }
                const activigtytData = await activityResponse.json();
                setActivity(activigtytData);

                // Calculate the count of act_ID
                const counts = manageData.reduce((acc, item) => {
                    acc[item.act_ID] = (acc[item.act_ID] || 0) + 1;
                    return acc;
                }, {});
                setActIDCounts(counts);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div data-theme="dark">
                <div className="overflow-x-auto">
                    {Object.entries(actIDCounts).map(([act_ID, count]) => {
                        const group = data.filter(item => item.act_ID === act_ID);

                        return (
                            
                            <div key={act_ID} className="mb-16 flex">
                                <div className="w-1/4 text-center items-center">
                                    <h2>Activity ID: {act_ID}</h2>
                                    <p>Number of Student: {count} / {}</p>
                                </div>
                                <div className="w-3/4">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Confirm</th>
                                                <th>Management ID</th>
                                                <th>Activity ID</th>
                                                <th>Student ID</th>
                                                <th>Name</th>
                                                <th>Details</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {group.map(item => {
                                                const student = students.find(student => student.std_ID === item.std_ID);
                                                return (
                                                    <tr key={item.man_ID}>
                                                        <td>
                                                            <label>
                                                                <input type="checkbox" className="checkbox" />
                                                            </label>
                                                        </td>
                                                        <td>{item.man_ID}</td>
                                                        <td>{item.act_ID}</td>
                                                        <td>{item.std_ID}</td>
                                                        <td>{student ? `${student.std_fname} ${student.std_lname}` : 'N/A'}</td>
                                                        <td>
                                                            <button className="btn btn-ghost btn-xs">Details</button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    })}
                    <div className="flex justify-center mt-16">
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </div>
                </div>

        </div>
    );
}

export default ToContract;
