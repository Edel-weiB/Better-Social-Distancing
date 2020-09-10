package com.example.cotrace.ui.hotspot;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.Toast;
import android.widget.ViewSwitcher;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import com.example.cotrace.APITask;
import com.example.cotrace.R;
import com.example.cotrace.graphXYValue;
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
import com.jjoe64.graphview.GraphView;
import com.jjoe64.graphview.series.DataPoint;
import com.jjoe64.graphview.series.LineGraphSeries;
import com.jjoe64.graphview.series.PointsGraphSeries;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

import static android.content.ContentValues.TAG;

public class HotspotFragment extends Fragment implements OnMapReadyCallback, onAPICompleted {

//    private HotspotViewModel hotspotViewModel;
    private View root;
    private ViewSwitcher viewSwitcher;
    private GraphView graph;
    private Button graphBtn, heatmapBtn;
    GoogleMap mHeatMap;
    MapView mMapView;
    private HeatmapTileProvider mProvider;
    private TileOverlay mOverlay;

    private JSONObject pointsAPIJSON;
    private PointsGraphSeries<DataPoint> graphSeries;

    private ArrayList<ArrayList> hotspotList;
    private ArrayList<LatLng> heatmapList = null;
    private ArrayList<graphXYValue> graphList = null;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
//        hotspotViewModel =
//                ViewModelProviders.of(this).get(HotspotViewModel.class);
        Toast.makeText(getContext(), "Please wait...", Toast.LENGTH_LONG).show();

        // Async API Call
        APITask getAPICall = new APITask(getContext(), "http://192.168.1.207:3000/map", this);
        getAPICall.execute();


        try {
            root = inflater.inflate(R.layout.fragment_hotspots, container, false);

            viewSwitcher = (ViewSwitcher) root.findViewById(R.id.hotspotViewSwitcher);

            MapsInitializer.initialize(this.getActivity());
            mMapView = (MapView) root.findViewById(R.id.heatmap);
            mMapView.onCreate(savedInstanceState);

            graph = root.findViewById(R.id.graph);
            graphSeries = new PointsGraphSeries<>();

            graphBtn = (Button) root.findViewById(R.id.graphBtn);
            heatmapBtn = (Button) root.findViewById(R.id.heatmapBtn);

            graphBtn.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (viewSwitcher.getCurrentView() != graph) {
                        viewSwitcher.showNext();
                    }
                }
            });

            heatmapBtn.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (viewSwitcher.getCurrentView() != mMapView) {
                        viewSwitcher.showPrevious();
                    }
                }
            });
        }
        catch (android.view.InflateException e){
            Log.e(TAG, "Hotspot Inflate exception");
        }

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
        addHeatmap();
    }

    /**
     * Add a heatmap layer
     */
    private void addHeatmap() {
        // Create a heat map tile provider, passing it the latlngs of the police stations.
        mProvider = new HeatmapTileProvider.Builder()
                .data(heatmapList)
                .build();
        // Add a tile overlay to the map, using the heat map tile provider.
        mOverlay = mHeatMap.addTileOverlay(new TileOverlayOptions().tileProvider(mProvider));
    }

    /**
     * Read JSONObject layer
     * @return list: ArrayList
     */
    private ArrayList<ArrayList> readItems(int resource) throws JSONException {
        ArrayList<LatLng> heatmapList = new ArrayList<LatLng>();
        ArrayList<graphXYValue> graphList = new ArrayList<>();

        InputStream inputStream = getResources().openRawResource(resource);
        String json = new Scanner(inputStream).useDelimiter("\\A").next();
        JSONArray array = new JSONArray(json);

        // Read object and add to heatmapList and graphList
        for (int i = 0; i < array.length(); i++) {

            JSONObject object = array.getJSONObject(i);
            double lat = object.getDouble("lat");
            double lng = object.getDouble("lng");
            heatmapList.add(new LatLng(lat, lng));
            graphList.add(new graphXYValue(lng, lat));
        }

        ArrayList<ArrayList> resultArray = new ArrayList<>();
        resultArray.add(heatmapList);
        resultArray.add(graphList);
        return resultArray;
    }

    /**
     * Add a graph layer
     * @param graphArray:
     */
    private void addGraphData(ArrayList<graphXYValue> graphArray) {
        Log.d(TAG, "addGraphData: Creating scatter plot.");

        // Sort the array of xy values
        ArrayList<graphXYValue> sortedGraphArray = sortArray(graphArray);

        // Add data to series
        for (int i=0; i < sortedGraphArray.size(); i++) {
            double x = sortedGraphArray.get(i).getX();
            double y = sortedGraphArray.get(i).getY();

            Log.d("hotspot points", i + ": " + x);
            Log.d("hotspot points", i + ": " + y);
            graphSeries.appendData(new DataPoint(x, y), true, 1000);

            //set Scrollable and Scaleable
            graph.getViewport().setScalable(true);
            graph.getViewport().setScalableY(true);
            graph.getViewport().setScrollable(true);
            graph.getViewport().setScrollableY(true);

            //set manual x bounds
            graph.getViewport().setYAxisBoundsManual(true);
            graph.getViewport().setMaxY(-35);
            graph.getViewport().setMinY(-40);

            //set manual y bounds
            graph.getViewport().setXAxisBoundsManual(true);
            graph.getViewport().setMaxX(147);
            graph.getViewport().setMinX(139);


            graph.addSeries(graphSeries);
        }
    }

    /**
     * Sorts an ArrayList<XYValue> with respect to the x values.
     * @param graphArray:
     * @return graphArray
     */
    private ArrayList<graphXYValue> sortArray(ArrayList<graphXYValue> graphArray){
    /*
    //Sorts the xyValues in Ascending order to prepare them for the PointsGraphSeries<DataSet>
     */
        int factor = Integer.parseInt(String.valueOf(Math.round(Math.pow(graphArray.size(),2))));
        int m = graphArray.size() - 1;
        int count = 0;
        Log.d(TAG, "sortArray: Sorting the XYArray.");


        while (true) {
            m--;
            if (m <= 0) {
                m = graphArray.size() - 1;
            }
            Log.d(TAG, "sortArray: m = " + m);
            try {
                //print out the y entrys so we know what the order looks like
                //Log.d(TAG, "sortArray: Order:");
                //for(int n = 0;n < array.size();n++){
                //Log.d(TAG, "sortArray: " + array.get(n).getY());
                //}
                double tempY = graphArray.get(m - 1).getY();
                double tempX = graphArray.get(m - 1).getX();
                if (tempX > graphArray.get(m).getX()) {
                    graphArray.get(m - 1).setY(graphArray.get(m).getY());
                    graphArray.get(m).setY(tempY);
                    graphArray.get(m - 1).setX(graphArray.get(m).getX());
                    graphArray.get(m).setX(tempX);
                } else if (tempX == graphArray.get(m).getX()) {
                    count++;
                    Log.d(TAG, "sortArray: count = " + count);
                } else if (graphArray.get(m).getX() > graphArray.get(m - 1).getX()) {
                    count++;
                    Log.d(TAG, "sortArray: count = " + count);
                }
                //break when factorial is done
                if (count == factor) {
                    break;
                }
            } catch (ArrayIndexOutOfBoundsException e) {
                Log.e(TAG, "sortArray: ArrayIndexOutOfBoundsException. Need more than 1 data point to create Plot." +
                        e.getMessage());
                break;
            }
        }
        return graphArray;
    }

    /**
     * onAPICompleted callback, will return API GET in JSONObject
     * @param value: JSONObject
     */
    @Override
    public void onAPICompleted(JSONObject value) {
        Log.i("onAPICompleted Listener", String.valueOf(value));
        pointsAPIJSON = value;

        //TODO: add pointsAPIJSON
        // Get the data: latitude/longitude positions of place locations.
        try {
            hotspotList = readItems(R.raw.place_locations);
            heatmapList = hotspotList.get(0);
            graphList = hotspotList.get(1);
        } catch (JSONException e) {
            Toast.makeText(getContext(), "Problem reading list of locations.", Toast.LENGTH_LONG).show();
        }

        // Only populate map after API callback is completed
        mMapView.getMapAsync(this);

        // Populate graph
        addGraphData(graphList);
    }
}
