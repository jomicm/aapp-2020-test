import React, { useState, useEffect } from 'react';
import { pick } from "lodash";
import {
  InputAdornment,
} from "@material-ui/core";
import BaseFields from '../../Components/BaseFields/BaseFields';
import { ContactSupportOutlined } from '@material-ui/icons';

const AssetEditon = ({
  assetEditionValues,
  setAssetEditionValues
}) =>  {

  const [values, setValues] = useState({
    serial: '',
    notes: '',
    quantity: 0,
    purchase_date: '',
    purchase_price: 0,
    price: 0,
    location: '',
  });

  useEffect(() => {
    setValues(pick(assetEditionValues, ['serial', 'notes', 'quantity', 'purchase_date', 'purchase_price', 'price', 'location'])) 
  }, [assetEditionValues])

  useEffect(() => {
    setAssetEditionValues(values);
  }, [values])

  const [formValidation, setFormValidation] = useState({
    enabled: false,
    isValidForm: {}
  });

  const handleChange = name => event => {
    if (name === 'price' || name === 'purchase_price') {
      setValues({ ...values, [name]: Number(event.target.value) });
    }
    else {
      setValues({ ...values, [name]: event.target.value });
    }
  };


  const baseFieldsLocalProps = {
    serialNumber: {
      componentProps: {
        onChange: handleChange('serial'),
        value: values.serial,
      }
    },
    notes: {
      componentProps: {
        onChange: handleChange('notes'),
        value: values.notes,
        multiline: true,
        rows: 4
      }
    },
    quantity: {
      componentProps: {
        onChange: handleChange('quantity'),
        value: values.quantity,
        type: "number",
      }
    },
    purchaseDate: {
      componentProps: {
        onChange: handleChange('purchase_date'),
        value: values.purchase_date,
        type: "date",
        InputLabelProps: {
          shrink: true
        }
      }
    },
    purchasePrice: {
      ownValidFn: () => !!values.purchase_price || values.purchase_price === 0,
      componentProps: {
        onChange: handleChange('purchase_price'),
        value: values.purchase_price,
        type: "number",
        InputProps: {
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }
      }
    },
    price: {
      ownValidFn: () => !!values.price || values.price === 0,
      componentProps: {
        onChange: handleChange('price'),
        value: values.price,
        type: "number",
        InputProps: {
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }
      }
    },
    location: {
      componentProps: {
        onChange: handleChange('location'),
        value: values.location,
        inputProps: {
          readOnly: true,
        }
      }
    },
  };

  return (
    <div>
      {
        values.id ? (
          <BaseFields
            catalogue={'assetEdition'}
            collection={'assets'}
            formState={[formValidation, setFormValidation]}
            localProps={baseFieldsLocalProps}
            values={values}
          />
        ) : (
          <h6>First Choose an Asset</h6>
        )
      }
    </div>
  )
};

export default AssetEditon;
