import "./Table.css";

const Table = () => {
  return (
    <div className="table">
      <h1>
        <span className="blue">&lt;</span>Table
        <span className="blue">&gt;</span>{" "}
        <span className="yellow">Responsive</span>
      </h1>

      <table className="container">
        <thead>
          <tr>
            <th>
              <h1>Name</h1>
            </th>
            <th>
              <h1>Blood Group</h1>
            </th>
            <th>
              <h1>Last Donate</h1>
            </th>
            <th>
              <h1>Phone</h1>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Google</td>
            <td>9518</td>
            <td>6369</td>
            <td>01:32:50</td>
          </tr>
          <tr>
            <td>Twitter</td>
            <td>7326</td>
            <td>10437</td>
            <td>00:51:22</td>
          </tr>
          <tr>
            <td>Amazon</td>
            <td>4162</td>
            <td>5327</td>
            <td>00:24:34</td>
          </tr>
          <tr>
            <td>LinkedIn</td>
            <td>365;'4</td>
            <td>2961</td>
            <td>00:12:10</td>
          </tr>
          <tr>
            <td>CodePen</td>
            <td>2002</td>
            <td>4135</td>
            <td>00:46:19</td>
          </tr>
          <tr>
            <td>GitHub</td>
            <td>4623</td>
            <td>3486</td>
            <td>00:31:52</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
