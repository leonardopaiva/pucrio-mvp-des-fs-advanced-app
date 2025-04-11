import { useEffect, useState } from "react";
import MainContentAppointments from "./MainContentAppointments";
import AppGlobalStatesService from "../../../services/AppGlobalStatesService";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Tooltip } from "@mui/material";
import PageContainer from "../../../components/PageContainer";


export default function ListAppointments() {
  const [exampleGlobalState, setExampleGlobalState] = useState(false);

  useEffect(() => {
    AppGlobalStatesService.setExampleGlobalStateFn(setExampleGlobalState);
  }, []);

  return (
    <>
      {exampleGlobalState && (
        <Tooltip title="Like">
          <ThumbUpIcon />
        </Tooltip>
      )}
      <PageContainer>
        <MainContentAppointments />
      </PageContainer>
    </>
  );
}
