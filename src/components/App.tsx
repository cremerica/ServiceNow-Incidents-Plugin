import React from "react";
import { CortexApi } from "@cortexapps/plugin-core";
import "../baseStyles.css";
import {
  SimpleTable,
  Box,
  Text,
  usePluginContext
  

} from "@cortexapps/plugin-core/components";

// import ErrorBoundary from "./ErrorBoundary";
const snURL = `https://dev67337.service-now.com`;

const App: React.FC = () => {
  const context = usePluginContext();
  console.log(context); 
  const [posts, setPosts] = React.useState<any[]>([]);
  console.log(context)
  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const cortexService = context.entity!.name as string;
    //  const cortexService = await getServiceName();
      console.log(cortexService)
      const serviceURLName: string = encodeURIComponent(cortexService);
      const result = await CortexApi.proxyFetch(
        `${snURL}/api/now/table/cmdb_ci_service?sysparm_query=name%3D${serviceURLName}`
      );
      const resultJson = await result.json();
      console.log({resultJson})
      const sysId: string = resultJson.result[0].sys_id;
      const iResult = await CortexApi.proxyFetch(
        snURL + `/api/now/table/incident?sysparm_display_value=true&sysparm_query=business_service%3D${sysId}`
      );
      const jResult = await iResult.json();
      console.log({jResult})
      setPosts(jResult.result);
    };
    void fetchData();
  }, []);
  const config = { 
      columns: [{
        Cell: (number: string) => <Box ><Text>{number}</Text></Box>,
        accessor: 'number',
        id: 'number',
        title: 'Number',
        width: '10%'
      }, {
        Cell: (title: string) => <Box><Text>{title}</Text></Box>,
        accessor: 'short_description',
        id: 'short_description',
        title: 'Short Description',
        width: '65%'
      }, {
        Cell: (state: string) => <Box flex justifyContent={'center'}><Text>{state}</Text></Box>,
        accessor: 'state',
        id: 'state',
        title: 'State',
      }]
    }

    return (
      <div className="posts-container">
        <SimpleTable config={config} items={posts} />
      </div>
      );

        
};


export default App;
