package com.example.cotrace;

import android.annotation.SuppressLint;
import android.content.Context;
import android.os.AsyncTask;
import android.util.Log;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

public class APITask extends AsyncTask<String, String, String> {

    private Boolean apiOnResponse;
    private RequestQueue queue;
    private String apiEndpoint;
    private JSONObject finalJSONResponse;

    private onAPICompleted apiListener;

    public APITask(Context context, String endpoint, onAPICompleted listener) {
        apiEndpoint = endpoint;
        apiListener=listener;
        queue = Volley.newRequestQueue(context);
    }


    @Override
    protected void onPreExecute() {
        super.onPreExecute();
        apiOnResponse = false;
    }

    @Override
    protected String doInBackground(String... args) {
        Log.i("api call", "start");
        try {
            while (!apiOnResponse) {
                // Ask database object to request database
                apiCall(apiEndpoint);
                Thread.sleep(1000);
            }
        } catch (Throwable e) {
            e.printStackTrace();
        }

        return "Executed";
    }

    @SuppressLint("Assert")
    @Override
    protected void onPostExecute(String result) {
        super.onPostExecute(result);

        Log.i("apicall done", result);

        // Test API call
        assert apiOnResponse;

        apiListener.onAPICompleted(finalJSONResponse);


    }

    /**
     * This method will call our database endpoint
     * @return
     */
    private void apiCall(String apiEndpoint) {

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, apiEndpoint, null, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                try {
                    JSONObject jsonObject = new JSONObject(response.toString());

                    Log.i("On Get Request Result", String.valueOf(jsonObject));
                    // Api successful
                    apiOnResponse = true;

                    finalJSONResponse = jsonObject;

                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                error.printStackTrace();
            }
        });

        queue.add(request);
    }
}
