import { connect } from "react-redux";
import CampaignButton, {
  mapStateToProps,
  mapDispatchToProps
} from "./CampaignButton";

export default connect(mapStateToProps, mapDispatchToProps)(CampaignButton);
