<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="f8f9fa" style="font-family: Verdana, sans-serif;letter-spacing: -0.5px;">
  <tr><td height="20">&nbsp;</td></tr>
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="ffffff" style="border:1px solid #ddd;">
        <tr>
          <td colspan="3" align="center" bgcolor="007bff" style="padding: 0;color: #ffffff;">
            <img src="https://www.expostandzone.com/web/images/open-email-logo-new.png" alt="ExpostandZone" style="max-width: 600px; margin-bottom: 20px;">
            <h1 style="font-size: 24px; margin-top: 10px; font-weight: bold;line-height: 24px;margin-bottom: 5px;">RFQ {{ $resleaddetail[0]['quote_token_no'] ?? '' }}</h1>
            <p style="margin:0; font-size: 17px;margin-bottom: 20px;">Exhibition Stand Enquiry</p>
          </td>
        </tr>
        <tr><td colspan="3" height="20">&nbsp;</td></tr>
        <tr>
          <td width="20">&nbsp;</td>
          <td align="center">
            <table width="558" cellpadding="0" cellspacing="0" bgcolor="F8F9FF" style="border: 1px solid #007bff;">
              <tr><td colspan="2">&nbsp;</td></tr>
              <tr><td colspan="2" style="font-size: 18px; color: #333;line-height: 24px;font-weight: 600;padding: 0 15px;">Project Details</td></tr>
              <tr><td colspan="2" height="10">&nbsp;</td></tr>
              <tr><td style="font-size: 17px;padding: 6px 15px;border-bottom:1px solid #E9ECEF;">Event Name:</td><td style="font-size: 16px;padding: 6px 15px;border-bottom:1px solid #E9ECEF;">{{ $resleaddetail[0]['quote_event_name'] ?? '' }}</td></tr>
              <tr><td style="font-size: 17px;padding: 6px 15px;border-bottom:1px solid #E9ECEF;">Event City:</td><td style="font-size: 17px;padding: 6px 15px;border-bottom:1px solid #E9ECEF;">{{ $resleaddetail[0]['quote_event_city'] ?? '' }}</td></tr>
              <tr><td style="font-size: 17px;padding: 6px 15px;border-bottom:1px solid #E9ECEF;">Stand Size :</td><td style="font-size: 17px;padding: 6px 15px;border-bottom:1px solid #E9ECEF;">{{ $resleaddetail[0]['quote_stand_area'] ?? '' }} {{ $resleaddetail[0]['quote_area_type'] ?? '' }}</td></tr>
              <tr><td style="font-size: 17px;padding: 6px 15px;border-bottom:1px solid #E9ECEF;">Contact Name:</td><td style="font-size: 17px;padding: 6px 15px;border-bottom:1px solid #E9ECEF;">{{ $resleaddetail[0]['quote_name'] ?? '' }}</td></tr>
              <tr><td style="font-size: 17px;padding: 6px 15px;border-bottom:1px solid #E9ECEF;">Email:</td><td style="font-size: 17px;padding: 6px 15px;border-bottom:1px solid #E9ECEF;">{{ $resleaddetail[0]['quote_email'] ?? '' }}</td></tr>
              <tr><td style="font-size: 17px;padding: 6px 15px;border-bottom:1px solid #E9ECEF;">Phone:</td><td style="font-size: 17px;padding: 6px 15px;border-bottom:1px solid #E9ECEF;">{{ $resleaddetail[0]['quote_mobile'] ?? '' }}</td></tr>
              <tr><td style="font-size: 17px;padding: 6px 15px;border-bottom:1px solid #E9ECEF;">Website:</td><td style="font-size: 17px;padding: 6px 15px;border-bottom:1px solid #E9ECEF;">{{ $resleaddetail[0]['company_website'] ?? '' }}</td></tr>
              <tr><td colspan="2" style="font-size: 16px;padding: 9px 15px;border-bottom:1px solid #E9ECEF;">{{ $resleaddetail[0]['quote_event_desc'] ?? '' }}</td></tr>
              <tr><td style="font-size: 17px;padding: 6px 15px;border-bottom:1px solid #E9ECEF;">Page Source:</td><td style="font-size: 17px;padding: 6px 15px;border-bottom:1px solid #E9ECEF;">{{ url('/') }}{{ $resleaddetail[0]['page_url'] ?? '' }}</td></tr>
              <tr><td style="font-size: 17px;padding: 6px 15px;border-bottom:1px solid #E9ECEF;">IP Address:</td><td style="font-size: 17px;padding: 6px 15px;border-bottom:1px solid #E9ECEF;">{{ $resleaddetail[0]['ipaddress'] ?? '' }}</td></tr>
              <tr><td colspan="2">&nbsp;</td></tr>
            </table>
          </td>
          <td width="20">&nbsp;</td>
        </tr>
        <tr><td colspan="3" height="20">&nbsp;</td></tr>
      </table>
    </td>
  </tr>
  <tr><td height="20">&nbsp;</td></tr>
</table>
