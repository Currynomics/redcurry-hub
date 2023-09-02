import React from 'react'
import { useFormFields } from 'payload/components/forms';
import '../styles/styles.scss';
import AssetType from '../../core/assets/model/enums/AssetType';
import { numberToCurrency } from '../../core/util/formatter';
import { calculateSharePositionValues } from '../../core/assets/services/calculations';

const AppMessage: React.FC = (props: { text, type }) => {
  const text = props.text;
  const msgType = props.type;

  const fieldKeys = {
    sh0Parts: "shares.0.nrOfParts",
    sh0Price: "shares.0.pricePerPart",
    sh1Parts: "shares.1.nrOfParts",
    sh1Price: "shares.1.pricePerPart",
    sh2Parts: "shares.2.nrOfParts",
    sh2Price: "shares.2.pricePerPart",
    sh3Parts: "shares.3.nrOfParts",
    sh3Price: "shares.3.pricePerPart",
    sh4Parts: "shares.4.nrOfParts",
    sh4Price: "shares.4.pricePerPart",
    sh5Parts: "shares.5.nrOfParts",
    sh5Price: "shares.5.pricePerPart",
    sh6Parts: "shares.6.nrOfParts",
    sh6Price: "shares.6.pricePerPart",
    coa: "",
    olta: "",
    osta: "",
    rec: "",
    lia: "",
    oavi: "",
    oavr: ""
  }

  let oav = Number(useFormFields(([fields, dispatch]) => fields.oav.value));
  let oiPercentage = Number(useFormFields(([fields, dispatch]) => fields.ownershipPercentage.value));
  if (typeof oiPercentage == "undefined" || oiPercentage < 0 || oiPercentage > 100) oiPercentage = 100; // default to 100

  let shares = []
  let cashflow = 0
  // For loop would not work as react hooks cannot be called inside for loop. So we have to create the horror show below.
  let partsObj = useFormFields(([fields, dispatch]) => { return fields[fieldKeys.sh0Parts] })
  let priceObj = useFormFields(([fields, dispatch]) => { return fields[fieldKeys.sh0Price] })
  if (partsObj && priceObj.value && partsObj.value) shares.push({ nrOfParts: Number(partsObj.value), pricePerPart: Number(priceObj.value) });

  partsObj = useFormFields(([fields, dispatch]) => { return fields[fieldKeys.sh1Parts] })
  priceObj = useFormFields(([fields, dispatch]) => { return fields[fieldKeys.sh1Price] })
  if (partsObj && priceObj.value && partsObj.value) shares.push({ nrOfParts: Number(partsObj.value), pricePerPart: Number(priceObj.value) });

  partsObj = useFormFields(([fields, dispatch]) => { return fields[fieldKeys.sh2Parts] })
  priceObj = useFormFields(([fields, dispatch]) => { return fields[fieldKeys.sh2Price] })
  if (partsObj && priceObj.value && partsObj.value) shares.push({ nrOfParts: Number(partsObj.value), pricePerPart: Number(priceObj.value) });

  partsObj = useFormFields(([fields, dispatch]) => { return fields[fieldKeys.sh3Parts] })
  priceObj = useFormFields(([fields, dispatch]) => { return fields[fieldKeys.sh3Price] })
  if (partsObj && priceObj.value && partsObj.value) shares.push({ nrOfParts: Number(partsObj.value), pricePerPart: Number(priceObj.value) });

  partsObj = useFormFields(([fields, dispatch]) => { return fields[fieldKeys.sh4Parts] })
  priceObj = useFormFields(([fields, dispatch]) => { return fields[fieldKeys.sh4Price] })
  if (partsObj && priceObj.value && partsObj.value) shares.push({ nrOfParts: Number(partsObj.value), pricePerPart: Number(priceObj.value) });

  partsObj = useFormFields(([fields, dispatch]) => { return fields[fieldKeys.sh5Parts] })
  priceObj = useFormFields(([fields, dispatch]) => { return fields[fieldKeys.sh5Price] })
  if (partsObj && priceObj.value && partsObj.value) shares.push({ nrOfParts: Number(partsObj.value), pricePerPart: Number(priceObj.value) });

  partsObj = useFormFields(([fields, dispatch]) => { return fields[fieldKeys.sh6Parts] })
  priceObj = useFormFields(([fields, dispatch]) => { return fields[fieldKeys.sh6Price] })
  if (partsObj && priceObj.value && partsObj.value) shares.push({ nrOfParts: Number(partsObj.value), pricePerPart: Number(priceObj.value) });
  //I guess there aren't more than 6 parts normally? Complete random guess here, lets increase as we progress.

  const coa = useFormFields(([fields, dispatch]) => fields.coa.value);
  const oa = useFormFields(([fields, dispatch]) => fields.oa.value);
  const ral = useFormFields(([fields, dispatch]) => fields.ral.value);
  const bd = useFormFields(([fields, dispatch]) => fields.bd.value);
  const oavi = useFormFields(([fields, dispatch]) => fields.oavi.value);
  const oavr = useFormFields(([fields, dispatch]) => fields.oavr.value);

  if (shares && shares.length > 0) {
    const positionValues = calculateSharePositionValues(shares)
    oav = positionValues.value
    cashflow = positionValues.cashflow
  }


  // NAV = OAV + COA + OLTA + OSTA + RAL - BD - OAVi + OAVr
  let nav = 0
  oav ? nav += oav : void 0;
  coa ? nav += Number(coa) : void 0;
  oa ? nav += Number(oa) : void 0;
  ral ? nav += Number(ral) : void 0;
  bd ? nav -= Number(bd) : void 0;
  oavi ? nav -= Number(oavi) : void 0;
  oavr ? nav += Number(oavr) : void 0;

  if (!shares || shares.length == 0) {
    cashflow = -nav
  }

  const navCurrency = numberToCurrency(nav * oiPercentage / 100, "EUR");
  const cashflowCurrency = numberToCurrency(cashflow * oiPercentage / 100, "EUR");

  return (
    <div className={`app-msg-container ${msgType}`}>
      <div className='prefix'><div className="r-icon icon-info"></div></div>
      <div className='suffix'>
        <div className='app-message'>{text}<strong>{navCurrency}</strong></div>
        <span>cashflow: {cashflowCurrency}</span>
      </div>
    </div>
  );
};


export default AppMessage;