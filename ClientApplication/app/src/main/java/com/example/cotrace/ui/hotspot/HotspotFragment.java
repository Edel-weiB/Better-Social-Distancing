package com.example.cotrace.ui.hotspot;

import android.annotation.SuppressLint;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.example.cotrace.APITask;
import com.example.cotrace.R;
import com.example.cotrace.onAPICompleted;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.MapsInitializer;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.TileOverlay;
import com.google.android.gms.maps.model.TileOverlayOptions;
import com.google.maps.android.heatmaps.HeatmapTileProvider;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Scanner;

import static android.content.ContentValues.TAG;

public class HotspotFragment extends Fragment implements OnMapReadyCallback, onAPICompleted {

//    private HotspotViewModel hotspotViewModel;
    private View root;
    GoogleMap mHeatMap;
    MapView mMapView;
    private HeatmapTileProvider mProvider;
    private TileOverlay mOverlay;

    private JSONObject pointsAPIJSON;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
//        hotspotViewModel =
//                ViewModelProviders.of(this).get(HotspotViewModel.class);
        Toast.makeText(getContext(), "Please wait...", Toast.LENGTH_LONG).show();

        // Async API Call
        APITask getAPICall = new APITask(getContext(), "https://api.data.gov.sg/v1/transport/carpark-availability", this);
        getAPICall.execute();


        try {
            root = inflater.inflate(R.layout.fragment_hotspots, container, false);
            MapsInitializer.initialize(this.getActivity());
            mMapView = (MapView) root.findViewById(R.id.heatmap);
            mMapView.onCreate(savedInstanceState);
        }
        catch (android.view.InflateException e){
            Log.e(TAG, "Hotspot Inflate exception");
        }
//        final TextView textView = root.findViewById(R.id.text_hotspots);
//        hotspotViewModel.getText().observe(getViewLifecycleOwner(), new Observer<String>() {
//            @Override
//            public void onChanged(@Nullable String s) {
//                textView.setText(s);
//            }
//        });
        return root;
    }

    /**
     * Life cycle for using MapView
     */
    @Override
    public void onPause() {
        super.onPause();
        mMapView.onPause();
    }
    @Override
    public void onDestroy() {
        super.onDestroy();
        mMapView.onDestroy();
    }

    @Override
    public void onSaveInstanceState(Bundle outState)
    {
        super.onSaveInstanceState(outState);
        mMapView.onSaveInstanceState(outState);
    }
    @Override
    public void onLowMemory()
    {
        super.onLowMemory();
        mMapView.onLowMemory();
    }
    @Override
    public void onResume() {
        super.onResume();
        mMapView.onResume();
    }
    @Override
    public void onDestroyView() {
        super.onDestroyView();
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        mHeatMap = googleMap;

        Log.i("TEST POINTS", String.valueOf(pointsAPIJSON));

        // Add a marker in Sydney and move the camera
        LatLng sydney = new LatLng(-34, 151);
        mHeatMap.addMarker(new MarkerOptions().position(sydney).title("Marker in Sydney"));
        mHeatMap.moveCamera(CameraUpdateFactory.newLatLng(sydney));
        addHeatMap();
    }

    /**
     * Add a heatmap layer
     */
    private void addHeatMap() {
        List<LatLng> heatMapList = null;

        //TODO: add pointsAPIJSON
        // Get the data: latitude/longitude positions of place locations.
        try {
            heatMapList = readItems(R.raw.place_locations);
        } catch (JSONException e) {
            Toast.makeText(getContext(), "Problem reading list of locations.", Toast.LENGTH_LONG).show();
        }

        // Create a heat map tile provider, passing it the latlngs of the police stations.
        mProvider = new HeatmapTileProvider.Builder()
                .data(heatMapList)
                .build();
        // Add a tile overlay to the map, using the heat map tile provider.
        mOverlay = mHeatMap.addTileOverlay(new TileOverlayOptions().tileProvider(mProvider));

    }

    /**
     * Add a heatmap layer
     */
    private ArrayList<LatLng> readItems(int resource) throws JSONException {
        ArrayList<LatLng> list = new ArrayList<LatLng>();
        InputStream inputStream = getResources().openRawResource(resource);
        String json = new Scanner(inputStream).useDelimiter("\\A").next();
        JSONArray array = new JSONArray(json);
        for (int i = 0; i < array.length(); i++) {
            JSONObject object = array.getJSONObject(i);
            double lat = object.getDouble("lat");
            double lng = object.getDouble("lng");
            list.add(new LatLng(lat, lng));
        }
        return list;
    }

    /**
     * onAPICompleted callback, will return API GET in JSONObject
     */
    @Override
    public void onAPICompleted(JSONObject value) {
        Log.i("onAPICompleted Listener", String.valueOf(value));
        pointsAPIJSON = value;
        // Only populate map after API callback is completed
        mMapView.getMapAsync(this);
    }
}
